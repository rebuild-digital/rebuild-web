import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import Layout from "~/components/layout/Layout";
import eventsData from "~/data/events.json";
import { shortDate, isPast } from "~/lib/dateFormat";

interface ProofPoint {
  headline: string;
  description: string;
}

interface Cta {
  text: string;
  url: string;
  dataForm?: string;
}

interface Gathering {
  id: string;
  title: string;
  shortTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  bgColor: string;
  image: string;
  imageCredit?: string;
  proofPoints: ProofPoint[];
  cta: Cta;
}

function useCountdown(targetDate: string) {
  const [text, setText] = createSignal("calculating...");

  onMount(() => {
    const update = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setText("now");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setText(`${days}d ${hours}h ${mins}m`);
    };
    update();
    const id = setInterval(update, 60_000);
    onCleanup(() => clearInterval(id));
  });

  return text;
}

function GatheringSection(props: { gathering: Gathering }) {
  const g = props.gathering;
  const countdown = useCountdown(g.startDate);
  const ended = isPast(g.endDate);

  return (
    <section
      id={g.id}
      class="relative w-full py-2xl lg:py-4xl"
      style={{
        "background-color": g.bgColor,
        "margin-left": "calc(-50vw + 50%)",
        "margin-right": "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      <div class="max-w-[1400px] mx-auto px-md">
        <div class="mb-2xl lg:mb-4xl">
          <div class="flex flex-col md:flex-row justify-between">
            <h2 class="text-3xl lg:text-5xl mb-md font-normal">{g.title}</h2>
            <div class="flex flex-col leading-tight lg:leading-none">
              <p class="text-md m-0 md:text-lg">{g.location}</p>
              <p class="text-md md:text-lg">
                {shortDate(g.startDate)} – {shortDate(g.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-xl mb-3xl md:mb-6xl">
          <div class="relative">
            <img
              src={g.image}
              alt={`${g.title} in ${g.location}`}
              class="w-full h-auto"
            />
            <Show when={g.imageCredit}>
              <span class="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-1 py-0.5">
                {g.imageCredit}
              </span>
            </Show>
          </div>

          <div class="space-y-lg lg:space-y-2xl mx-auto content-center">
            <For each={g.proofPoints}>
              {(point) => (
                <div class="max-w-[55ch] mx-auto">
                  <h3 class="text-xl md:text-2xl mb-xs md:mb-sm underline">{point.headline}</h3>
                  <p class="text-base md:text-lg">{point.description}</p>
                </div>
              )}
            </For>
          </div>
        </div>

        <Show when={!ended}>
          <hr class="pt-lg lg:hidden" />
          <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-lg">
            <div>
              <p class="text-base md:text-lg">{g.shortTitle} is happening in...</p>
              <p class="text-base md:text-lg underline">{countdown()}</p>
            </div>
            <div class="flex flex-col leading-none">
              <p class="text-base mb-sm md:text-lg">Want to be part of the gathering?</p>
              <a
                href={g.cta.url}
                data-form={g.cta.dataForm}
                class="inline-block px-md py-sm text-center border-2 border-dark hover:bg-dark hover:text-light text-base md:text-lg transition-all"
              >
                {g.cta.text}
              </a>
            </div>
          </div>
        </Show>
      </div>
    </section>
  );
}

export default function JourneyPage() {
  const gatherings = eventsData.events as Gathering[];

  return (
    <Layout
      title="Journey"
      description="The core approach to catalysing social platforms in Europe"
    >
      <section class="pt-xl md:pb-2xl">
        <header class="mb-sm md:mb-xl text-center w-full">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Journey</h1>
        </header>
      </section>

      <section class="pb-3xl md:pb-6xl">
        <div class="rich-text max-w-[700px]">
          <p>
            The Rebuild journey is 12 months to support the new generation of social platforms.
            Through <strong>gatherings, programmes, and tools.</strong>
          </p>
          <p>
            When closing on 15 December 2026, Rebuild will have facilitated hundreds of defining
            new connections for rebuilding social platforms.
          </p>
        </div>
      </section>

      <section class="pb-4xl lg:pb-8xl">
        <div class="overflow-x-scroll md:overflow-hidden">
          <img
            src="/assets/images/kill-slide-graphic.png"
            alt="The Rebuild approach in one diagram: gatherings, programmes and tools distributed on a one year timeline."
            class="w-full h-auto"
          />
        </div>
      </section>

      <section class="pb-3xl md:pb-6xl">
        <div class="mb-2xl md:mb-5xl">
          <h3 id="gatherings" class="text-3xl lg:text-8xl font-bold">
            The beginning.
            <br />
            The boost.
            <br />
            The shift.
          </h3>
          <p class="mt-lg text-xl">Three connected gatherings across Europe in 2026</p>
        </div>
        <div class="max-w-[1400px] mx-auto">
          <div class="flex flex-col gap-y-xl lg:gap-y-3xl">
            <div class="flex flex-row justify-start">
              <div class="hidden lg:block w-20 h-20 rounded-full bg-dark" />
              <p class="md:text-3xl max-w-[800px] leading-tight ml-xl">
                Each a 48-hour catalyst for the people building the next generation of social
                platforms in Europe.
              </p>
            </div>
            <div class="flex flex-row justify-start">
              <div class="hidden lg:block w-20 h-20 rounded-full bg-dark" />
              <p class="md:text-3xl max-w-[800px] leading-tight ml-xl">
                The first hands-on assemblies tailored 100% to Europe's future social platform
                entrepreneurs.
              </p>
            </div>
            <div class="flex flex-row justify-start">
              <div class="hidden lg:block w-20 h-20 rounded-full bg-dark" />
              <p class="md:text-3xl max-w-[800px] leading-tight ml-xl">
                Where the entrepreneurs, investors, pioneers and digital leaders come together to
                move things forward.
              </p>
            </div>
            <div class="flex flex-row justify-start">
              <div class="hidden lg:block w-20 h-20 rounded-full bg-dark" />
              <p class="md:text-3xl max-w-[800px] leading-tight ml-xl">
                A focused 48-hour format: arrive Sunday afternoon, build hard through Monday, wrap
                it all Tuesday afternoon with new partners, ideas, and action plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="pb-3xl md:pb-6xl">
        <For each={gatherings}>{(g) => <GatheringSection gathering={g} />}</For>
      </section>

      <section class="pb-3xl md:pb-6xl">
        <div class="rich-text max-w-[700px]">
          <h2>In the planning for the next chapter:</h2>
          <div class="flex flex-col gap-lg mt-lg">
            <div>
              <h3 class="text-xl font-bold">Big Shift Day</h3>
              <p>Where Europeans make a collective shift.</p>
            </div>
            <div>
              <h3 class="text-xl font-bold">Industry organisation</h3>
              <p>
                Dedicated to becoming the future driver of initiatives for the social platforms of
                Europe.
              </p>
            </div>
            <div>
              <h3 class="text-xl font-bold">Annual Gathering</h3>
              <p>Carrying forward the initiative to assemble yearly.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
