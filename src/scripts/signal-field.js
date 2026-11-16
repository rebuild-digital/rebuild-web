/**
 * signal-field.js
 * ------------------------------------------------------------------
 * Matrix-style dot field with a strict grid.
 * Dots are binary: either "off" (ambient muted) or "on" (blue).
 * No gradient tails — a signal stream lights dots fully on, then off.
 *
 * Grid is fixed to data-cols x data-rows (default 13x13), centered
 * in the container. Cell size is computed to fill the available space.
 *
 * <canvas
 *   data-signal-field
 *   data-cols="13"
 *   data-rows="13"
 *   data-dot-gap="0.35"
 *   data-speed="1"
 *   data-frequency="1"
 *   data-seed="2025"
 * ></canvas>
 *
 * Optional:
 *   data-color-signal / data-color-ambient  hex overrides
 *   data-mode="fill"        dots light up one by one in random order until the
 *                           whole grid is filled, hold, fade out, then start
 *                           again with a new order (new order on every load too)
 *   data-fill-duration="14" seconds to fill the grid
 *   data-fill-hold="5"      seconds to hold the full grid before refreshing
 */
(function () {
  'use strict';

  var COLOR_AMBIENT = [217, 217, 224]; // #D9D9E0
  var COLOR_SIGNAL = [107, 161, 204]; // #6BA1CC
  var AMBIENT_ALPHA = 0.3;

  // Optional per-canvas colour overrides: data-color-signal / data-color-ambient (hex, e.g. "#22223e")
  function hexToRgb(hex, fallback) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback;
  }

  function initField(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var container = canvas.parentElement || canvas;

    var gridCols = parseInt(canvas.dataset.cols, 10) || 13;
    var gridRows = parseInt(canvas.dataset.rows, 10) || 13;
    var dotGap = parseFloat(canvas.dataset.dotGap) || 0.35;
    var speedMul = parseFloat(canvas.dataset.speed) || 1;
    var frequency = parseFloat(canvas.dataset.frequency) || 1;
    var colorSignal = hexToRgb(canvas.dataset.colorSignal, COLOR_SIGNAL);
    var colorAmbient = hexToRgb(canvas.dataset.colorAmbient, COLOR_AMBIENT);
    var seed = canvas.dataset.seed ? parseInt(canvas.dataset.seed, 10) : 2025;
    var mode = canvas.dataset.mode === 'fill' ? 'fill' : 'streams';
    var fillDuration = parseFloat(canvas.dataset.fillDuration) || 14;
    var fillHold = parseFloat(canvas.dataset.fillHold) || 5;
    var FILL_FADE_IN = 0.4; // seconds for each dot to appear
    var FILL_FADE_OUT = 1.5; // seconds for the full grid to clear

    var prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    var seedState = seed | 0;
    function rand() {
      seedState = (seedState + 0x6d2b79f5) | 0;
      var t = Math.imul(seedState ^ (seedState >>> 15), 1 | seedState);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function hash2(a, b) {
      var h = a * 374761393 + b * 668265263 + seed * 2654435761;
      h = (h ^ (h >>> 13)) * 1274126177;
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }

    var width = 0, height = 0, dpr = 1;
    var cellSize = 0, dotRadius = 0;
    var offsetX = 0, offsetY = 0;

    var streams = [];
    var lastSpawn = 0;
    var prevTime = null;
    var raf = 0;

    // Fill mode: rank[cellIndex] = position in this cycle's random fill order
    var fillRank = [];
    var fillStart = null;
    function newFillCycle(now) {
      var n = gridCols * gridRows;
      var order = [];
      for (var i = 0; i < n; i++) order.push(i);
      for (var j = n - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = order[j]; order[j] = order[k]; order[k] = tmp;
      }
      fillRank = new Array(n);
      for (var r = 0; r < n; r++) fillRank[order[r]] = r;
      fillStart = now;
    }

    // 0..1 opacity of the signal dot at cell index i in fill mode
    function fillAlpha(i, now) {
      if (prefersReducedMotion) return 1;
      var elapsed = (now - fillStart) / 1000;
      var n = gridCols * gridRows;
      var appearAt = (fillRank[i] / n) * fillDuration;
      var a = Math.max(0, Math.min(1, (elapsed - appearAt) / FILL_FADE_IN));
      var fadeOutAt = fillDuration + FILL_FADE_IN + fillHold;
      if (elapsed > fadeOutAt) a *= Math.max(0, 1 - (elapsed - fadeOutAt) / FILL_FADE_OUT);
      return a;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cellSize = Math.min(width / gridCols, height / gridRows);
      dotRadius = cellSize * (0.5 - dotGap / 2);
      offsetX = (width - cellSize * gridCols) / 2;
      offsetY = (height - cellSize * gridRows) / 2;
    }

    function spawnStream() {
      var col = Math.floor(rand() * gridCols);
      streams.push({
        col: col,
        head: -(2 + rand() * 4),
        speed: (2.5 + rand() * 3) * speedMul,
        length: 2 + Math.floor(rand() * 5)
      });
    }

    function stepStreams(dt, now) {
      var baseRate = (gridCols / 13) * frequency;
      if (now - lastSpawn > 1000 / Math.max(baseRate, 0.05)) {
        spawnStream();
        lastSpawn = now;
      }
      for (var i = streams.length - 1; i >= 0; i--) {
        var s = streams[i];
        s.head += s.speed * dt;
        if (s.head - s.length > gridRows + 2) streams.splice(i, 1);
      }
    }

    function drawFill(now) {
      ctx.clearRect(0, 0, width, height);
      if (fillStart == null) newFillCycle(now);
      var cycle = fillDuration + FILL_FADE_IN + fillHold + FILL_FADE_OUT + 0.6;
      if (!prefersReducedMotion && (now - fillStart) / 1000 > cycle) newFillCycle(now);

      for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
          var x = offsetX + c * cellSize + cellSize / 2;
          var y = offsetY + r * cellSize + cellSize / 2;

          // Every cell shows an ambient dot so the full grid is visible from the start
          var phase = hash2(c, r) * Math.PI * 2;
          var speedN = 0.15 + hash2(r, c) * 0.25;
          var wave = prefersReducedMotion ? Math.sin(phase) : Math.sin(now * 0.001 * speedN + phase);
          var ambientAlpha = (0.6 + 0.4 * wave) * AMBIENT_ALPHA;
          ctx.beginPath();
          ctx.fillStyle = 'rgba(' + colorAmbient[0] + ',' + colorAmbient[1] + ',' + colorAmbient[2] + ',' + ambientAlpha.toFixed(3) + ')';
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();

          var a = fillAlpha(r * gridCols + c, now);
          if (a > 0) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + colorSignal[0] + ',' + colorSignal[1] + ',' + colorSignal[2] + ',' + a.toFixed(3) + ')';
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    function draw(now) {
      if (mode === 'fill') return drawFill(now);
      ctx.clearRect(0, 0, width, height);

      var active = {};
      for (var si = 0; si < streams.length; si++) {
        var s = streams[si];
        for (var o = 0; o < s.length; o++) {
          var row = Math.floor(s.head - o);
          if (row < 0 || row >= gridRows) continue;
          active[s.col + ',' + row] = true;
        }
      }

      for (var r = 0; r < gridRows; r++) {
        for (var c = 0; c < gridCols; c++) {
          var x = offsetX + c * cellSize + cellSize / 2;
          var y = offsetY + r * cellSize + cellSize / 2;
          var isOn = active[c + ',' + r];

          // per-cell ambient visibility, seeded
          var presence = hash2(c * 3 + 1, r * 5 + 2);
          var showAmbient = presence > 0.3;

          if (isOn) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + colorSignal[0] + ',' + colorSignal[1] + ',' + colorSignal[2] + ',1)';
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (showAmbient) {
            var phase = hash2(c, r) * Math.PI * 2;
            var speedN = 0.15 + hash2(r, c) * 0.25;
            var wave = prefersReducedMotion
              ? Math.sin(phase)
              : Math.sin(now * 0.001 * speedN + phase);
            var breathing = 0.6 + 0.4 * wave;
            var alpha = presence * breathing * AMBIENT_ALPHA;

            ctx.beginPath();
            ctx.fillStyle = 'rgba(' + colorAmbient[0] + ',' + colorAmbient[1] + ',' + colorAmbient[2] + ',' + alpha.toFixed(3) + ')';
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    function loop(now) {
      if (prevTime == null) prevTime = now;
      var dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      if (mode !== 'fill') stepStreams(dt, now);
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      resize();
      if (prefersReducedMotion) {
        draw(0);
      } else {
        raf = requestAnimationFrame(loop);
      }
    }

    var resizeObserver = new ResizeObserver(function () {
      resize();
      if (prefersReducedMotion) draw(0);
    });
    resizeObserver.observe(container);

    start();

    canvas._signalFieldDestroy = function () {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }

  function initAll() {
    var canvases = document.querySelectorAll('[data-signal-field]');
    for (var i = 0; i < canvases.length; i++) initField(canvases[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
