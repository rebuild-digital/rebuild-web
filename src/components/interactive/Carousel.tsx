import { createSignal, For, onMount, onCleanup } from "solid-js";

export interface CarouselSlide {
  id: string;
  headline: string;
  subheader: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
}

export default function Carousel(props: CarouselProps) {
  const [current, setCurrent] = createSignal(0);
  let autoplayInterval: ReturnType<typeof setInterval> | undefined;

  const goTo = (index: number) => {
    let i = index;
    if (i < 0) i = props.slides.length - 1;
    if (i >= props.slides.length) i = 0;
    setCurrent(i);
  };

  const next = () => goTo(current() + 1);
  const prev = () => goTo(current() - 1);

  const startAutoplay = () => {
    autoplayInterval = setInterval(next, 7000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  onMount(() => {
    startAutoplay();

    const handleKeydown = (e: KeyboardEvent) => {
      if (props.slides.length === 0) return;
      if (e.key === "ArrowLeft") { prev(); restartAutoplay(); }
      else if (e.key === "ArrowRight") { next(); restartAutoplay(); }
    };

    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("visibilitychange", handleVisibility);

    onCleanup(() => {
      stopAutoplay();
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("visibilitychange", handleVisibility);
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  const handleTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
  const handleTouchEnd = (e: TouchEvent) => {
    const dist = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dist) < 50) return;
    if (dist > 0) { prev(); restartAutoplay(); }
    else { next(); restartAutoplay(); }
  };

  return (
    <>
      <section
        class="relative w-full overflow-hidden"
        style="height: 80vh"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Featured content carousel"
      >
        {/* Screen reader announcer */}
        <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
          Slide {current() + 1} of {props.slides.length}
        </div>

        <div class="relative w-full h-full">
          <For each={props.slides}>
            {(slide, index) => (
              <div
                class={`carousel-slide absolute top-0 left-0 w-full h-full${
                  index() === current()
                    ? " opacity-100! visible! pointer-events-auto!"
                    : " opacity-0 invisible pointer-events-none"
                }`}
                aria-hidden={index() !== current()}
                style={{ "background-color": slide.bgColor }}
              >
                <div class="w-full max-w-[1400px] mx-auto h-full">
                  <div class="grid grid-cols-1 md:grid-cols-2 items-center h-full">
                    <div class="w-full h-full order-1 md:order-1">
                      <img
                        src={slide.image}
                        alt={slide.headline}
                        loading="lazy"
                        class="w-full h-full max-h-[40vh] md:max-h-screen object-cover"
                      />
                    </div>
                    <div class="order-2 md:order-2 flex flex-col justify-center px-sm md:px-3xl">
                      <h2 class="text-3xl md:text-4xl lg:text-5xl font-normal mb-lg text-dark leading-tight">
                        {slide.headline}
                      </h2>
                      <p class="text-lg md:text-xl text-dark mb-xl leading-tight max-w-[65ch]">
                        {slide.subheader}
                      </p>
                      <a
                        href={slide.ctaLink}
                        class="inline-block px-sm py-xs bg-transparent border-2 border-dark text-dark hover:bg-dark hover:text-light transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue no-underline w-fit"
                      >
                        {slide.ctaText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </section>

      {/* Navigation Dots */}
      <div class="mt-sm md:mt-lg flex justify-center gap-sm z-10 mb-xl md:mb-0">
        <For each={props.slides}>
          {(_, index) => (
            <button
              class={`carousel-dot h-3 bg-muted border-0 cursor-pointer transition-all duration-fast hover:bg-darker${
                index() === current() ? " bg-dark! w-8!" : " w-3"
              }`}
              aria-label={`Go to slide ${index() + 1}`}
              onClick={() => { goTo(index()); restartAutoplay(); }}
            />
          )}
        </For>
      </div>
    </>
  );
}
