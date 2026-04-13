import Layout from "~/components/layout/Layout";
import SplashHero from "~/components/interactive/SplashHero";
import Carousel from "~/components/interactive/Carousel";
import carouselData from "~/data/carousel.json";

export default function HomePage() {
  return (
    <Layout
      title="Rebuild"
      description="Twelve months to catalyse European social platforms."
      isHomepage={true}
    >
      <SplashHero />

      <main id="main-content" class="lg:max-w-[1400px] mx-auto px-md">
        <section class="py-3xl md:py-6xl">
          <div class="rich-text max-w-[65ch]">
            <p class="text-lg md:text-xl leading-tight">
              Rebuild is a sprint for European social platforms. Connecting the entrepreneurs, the
              pioneers, the investors and the digital leaders building the next generation of social
              platforms.
              <br />
              <br />
              Through gatherings, programmes, and tools{" "}
              <span class="font-bold">we build</span>.
            </p>
          </div>
        </section>

        <section id="explore" class="pb-3xl md:pb-6xl">
          <Carousel slides={carouselData.slides} />
        </section>

        <section class="pb-3xl md:pb-6xl">
          <DirectoryPreview />
        </section>

        <section class="pb-3xl md:pb-6xl">
          <ProgrammesPreview />
        </section>

        <section class="pb-4xl md:pb-7xl">
          <InsightsPreview />
        </section>

        <section>
          <div class="rich-text max-w-[65ch]">
            <p class="text-lg md:text-xl leading-tight">
              Three 48-hour gatherings Rebuild 1, Rebuild 2, and Rebuild 3. Designed to connect,
              build, and act. Paris, Helsinki, and Copenhagen.
            </p>
          </div>
        </section>

        <section class="pb-3xl md:pb-6xl">
          <EngageSection />
        </section>
      </main>
    </Layout>
  );
}

function DirectoryPreview() {
  return (
    <div>
      <div class="flex justify-between items-end mb-lg">
        <h2 class="text-3xl md:text-5xl font-normal">Social Platform Directory</h2>
        <a href="/directory" class="text-sm underline hover:text-blue">
          View all →
        </a>
      </div>
      <p class="text-muted max-w-[55ch]">
        We are mapping all the social platforms in Europe. This directory is growing every day based
        on input from people all around Europe.
      </p>
      <div class="mt-lg">
        <a
          href="/directory"
          class="inline-block px-md py-sm border-2 border-dark text-dark hover:bg-dark hover:text-light transition-fast"
        >
          Explore the directory
        </a>
      </div>
    </div>
  );
}

function ProgrammesPreview() {
  return (
    <div>
      <h2 class="text-3xl md:text-5xl font-normal mb-lg">Programmes</h2>
      <p class="text-muted max-w-[55ch]">
        Structured programmes to accelerate European social platform builders.
      </p>
    </div>
  );
}

function InsightsPreview() {
  return (
    <div>
      <div class="flex justify-between items-end mb-lg">
        <h2 class="text-3xl md:text-5xl font-normal">Insights</h2>
        <a href="/insights" class="text-sm underline hover:text-blue">
          View all →
        </a>
      </div>
      <p class="text-muted max-w-[55ch]">
        Stories from early founders, current entrepreneurs, and insights from the Rebuild journey.
      </p>
    </div>
  );
}

function EngageSection() {
  return (
    <div class="flex flex-col gap-lg">
      <h2 class="text-3xl md:text-5xl font-normal">Get involved</h2>
      <div class="flex flex-wrap gap-sm">
        <button
          data-form="builder-promo"
          class="px-md py-sm border-2 border-dark text-dark hover:bg-dark hover:text-light transition-fast cursor-pointer"
        >
          Help map the platforms
        </button>
        <button
          data-form="newsletter"
          class="px-md py-sm border-2 border-dark text-dark hover:bg-dark hover:text-light transition-fast cursor-pointer"
        >
          Stay involved
        </button>
      </div>
    </div>
  );
}
