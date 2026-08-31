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
 */
(function () {
  'use strict';

  var COLOR_AMBIENT = [217, 217, 224]; // #D9D9E0
  var COLOR_SIGNAL = [107, 161, 204]; // #6BA1CC
  var AMBIENT_ALPHA = 0.3;

  function initField(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var container = canvas.parentElement || canvas;

    var gridCols = parseInt(canvas.dataset.cols, 10) || 13;
    var gridRows = parseInt(canvas.dataset.rows, 10) || 13;
    var dotGap = parseFloat(canvas.dataset.dotGap) || 0.35;
    var speedMul = parseFloat(canvas.dataset.speed) || 1;
    var frequency = parseFloat(canvas.dataset.frequency) || 1;
    var seed = canvas.dataset.seed ? parseInt(canvas.dataset.seed, 10) : 2025;

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

    function draw(now) {
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
            ctx.fillStyle = 'rgba(' + COLOR_SIGNAL[0] + ',' + COLOR_SIGNAL[1] + ',' + COLOR_SIGNAL[2] + ',1)';
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
            ctx.fillStyle = 'rgba(' + COLOR_AMBIENT[0] + ',' + COLOR_AMBIENT[1] + ',' + COLOR_AMBIENT[2] + ',' + alpha.toFixed(3) + ')';
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
      stepStreams(dt, now);
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
