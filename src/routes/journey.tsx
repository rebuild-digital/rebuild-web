import Layout from "~/components/layout/Layout";

export default function JourneyPage() {
  return (
    <Layout
      title="Journey"
      description="Follow the Rebuild journey — twelve months to catalyse European social platforms."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Journey</h1>
        </header>
      </section>

      <section class="pb-6xl">
        <div class="rich-text max-w-[700px]">
          <p>
            Rebuild is a twelve-month sprint that brings together the entrepreneurs, pioneers,
            investors, and digital leaders building the next generation of European social platforms.
          </p>
          <h2 id="gatherings">Gatherings</h2>
          <p>
            Three 48-hour gatherings — Rebuild 1, Rebuild 2, and Rebuild 3 — designed to connect,
            build, and act. Paris, Helsinki, and Copenhagen.
          </p>
          <div class="flex flex-wrap gap-sm mt-lg">
            <button
              data-form="gathering-invitation"
              class="px-md py-sm border-2 border-dark text-dark hover:bg-dark hover:text-light transition-fast cursor-pointer"
            >
              Request invitation
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
