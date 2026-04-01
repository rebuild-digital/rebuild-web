import Layout from "~/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout
      title="About"
      description="Rebuild is a twelve-month sprint for European social platforms, connecting entrepreneurs and fostering innovation."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl text-center w-full">
          <h1 class="font-normal text-7xl">About</h1>
        </header>
      </section>

      <section class="pb-6xl">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mx-auto">
            <div class="w-full">
              <img
                src="/assets/images/margrethe.jpg"
                alt="About Rebuild"
                class="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div class="rich-text max-w-[600px]">
              <h4 style="margin-top: 0px" class="mt-0">
                Social platforms are the critical communication infrastructure in our lives,
                communities, and democracies.
              </h4>
              <p>
                From how we communicate with our loved ones and connect with our neighbourhoods to
                exchanging ideas and sharing our thoughts.
              </p>
              <p>
                More than 20 years ago, Europe was buzzing. People were coming together from across
                the continent to build our social digital future — to make the internet social rather
                than transactional through innovation. A new type of platform emerged, pioneered by
                entrepreneurs also in European countries: social platforms.
              </p>
              <p>
                Today, social platforms are how we connect with new people, how we keep our families
                updated, how we socialise, how we organise, how we share, how we build relationships,
                how we find love, and how we exchange goods.
              </p>
              <p>
                They are critical infrastructure and an important industry that should employ
                hundreds of thousands of people in Europe. But in the 2000s, Europe lost the battle
                to a few centralised foreign platforms. We lost our social platform industry and our
                capacity to innovate.
              </p>
              <p>
                Luckily, new seeds of social platforms are popping up all over Europe. It's time to
                support and grow this new generation of builders.
              </p>
              <p>
                We've talked and reflected a lot in Europe; now it's time to rebuild. To regain our
                sovereignty. To rebuild an industry. To lead by innovating social platforms.
              </p>
              <p>
                On 15 December 2026, Rebuild will host the last gathering in Paris, open-sourcing
                all frameworks, tools and resources back to the industry.
              </p>
              <hr />
              <p class="mt-xl">
                Rebuild is an NGO, registered in Denmark, supported and funded by European
                entrepreneurs and the Danish Industry Foundation.
              </p>
              <p>Founded by Thomas Madsen-Mygdal, patroned by Margrethe Vestager.</p>
              <p class="text-sm text-darker">
                CVR 46007670
                <br />
                Linnésgade 25, 1361 Copenhagen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
