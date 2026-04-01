import { createSignal, For, onMount, onCleanup } from "solid-js";
import splashImages from "~/data/splashImages";

const ROTATION_INTERVAL = 4000;

export default function SplashHero() {
  const [current, setCurrent] = createSignal(0);
  let interval: ReturnType<typeof setInterval> | undefined;

  onMount(() => {
    interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % splashImages.length);
    }, ROTATION_INTERVAL);

    onCleanup(() => {
      if (interval) clearInterval(interval);
    });
  });

  return (
    <section
      id="hero-splash-alt"
      class="relative overflow-hidden h-[90vh] w-screen"
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Image Slideshow */}
      <div class="absolute top-0 left-0 w-full h-full z-10" aria-hidden="true">
        <For each={splashImages}>
          {(image, index) => (
            <div
              class={`splash-image absolute top-0 left-0 w-full h-full bg-cover bg-center${
                index() === current() ? " active" : ""
              }`}
              style={{ "background-image": `url('${image.src}')` }}
            >
              <img src={image.src} alt={image.alt} class="sr-only" />
            </div>
          )}
        </For>
      </div>

      {/* Gradient Overlay */}
      <div
        class="absolute bottom-0 left-0 w-full h-full pointer-events-none z-20"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(34,34,62,0.75) 0%, rgba(34,34,62,0.5) 20%, rgba(34,34,62,0) 40%, rgba(34,34,62,0) 60%, rgba(34,34,62,0.5) 80%, rgba(34,34,62,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div class="absolute bottom-0 left-0 w-full pb-2xl md:pb-xl z-30">
        <div class="container max-w-[1400px] mx-auto px-md flex flex-col lg:flex-row items-start justify-end lg:justify-between">
          <h1 class="text-light text-3xl md:text-5xl font-normal leading-none mb-lg md:mb-xl text-left max-w-[560px]">
            A sprint for european social platforms.
          </h1>

          <div class="w-full md:max-w-[560px] overflow-x-auto overflow-y-visible md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div class="flex flex-row flex-wrap gap-sm w-max md:w-full min-w-full md:min-w-0">
              <button
                data-form="builder-promo"
                class="bg-splash-button border-2 border-light px-md py-sm text-light text-base no-underline transition-all duration-fast hover:bg-light hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue whitespace-nowrap"
              >
                Help map the platforms
              </button>
              <button
                data-form="newsletter"
                class="bg-splash-button border-2 border-light px-md py-sm text-light text-base no-underline transition-all duration-fast hover:bg-light hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue whitespace-nowrap"
              >
                Stay involved
              </button>
              <a
                href="/journey/#rebuild-2"
                class="bg-splash-button border-2 border-light px-md py-sm text-light text-base no-underline transition-all duration-fast hover:bg-light hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue whitespace-nowrap"
              >
                Request invitation
              </a>
              <a
                href="https://letter.rebuild.net"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-splash-button border-2 border-light px-md py-sm text-light text-base no-underline transition-all duration-fast hover:bg-light hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue whitespace-nowrap"
              >
                Sign the rebuild letter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
