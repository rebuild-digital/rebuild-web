import Layout from "~/components/layout/Layout";
import { For } from "solid-js";

const ambassadors = [
  {
    name: "Sebastian Schwemer",
    image: "/assets/images/people/sebastian.jpg",
    specialty: "Technology and Law",
    bio: "Sebastian brings deep expertise in tech policy and regulation, as Professor of Law and Technology at BI Norwegian Business School. He has advised lawmakers on key digital legislation and holds a track record of launching and advising tech ventures.",
  },
  {
    name: "Linda Liukas",
    image: "/assets/images/people/linda.JPG",
    specialty: "Children",
    bio: "As bestselling author of the Hello Ruby series, she's helped countless children and adults understand coding and technology through storytelling.",
  },
  {
    name: "Mathias Ockenfals",
    image: "/assets/images/people/mathias.jpg",
    specialty: "Marketplaces",
    bio: "Mathias founded The Marketplace Conference, Europe's leading event for marketplace funders and founders. As a partner at b2venture, he's personally led investments in more than 70 startups.",
  },
  {
    name: "Henrik Torstensson",
    image: "/assets/images/people/henrik.JPG",
    specialty: "Business scaling",
    bio: "Henrik has scaled some of Europe's most successful tech companies. As head of premium sales and member of Spotify's global management team during its growth phase 2010–2013, later as CEO at Lifesum.",
  },
  {
    name: "Neil Murray",
    image: "/assets/images/people/neil.jpg",
    specialty: "Venture Capital",
    bio: "Neil is a Solo GP and founder of The Nordic Web Ventures, investing in early-stage Nordic founders and startups. He was among the first investors in Sanity and Lovable.",
  },
  {
    name: "Roxanne Varza",
    image: "/assets/images/people/roxanne.JPG",
    specialty: "Start-up ecosystem",
    bio: "Roxanne is the director of STATION F in Paris, the world's biggest startup campus. She is also an angel investor and on the board of media company NRJ Group.",
  },
  {
    name: "Stig Kirk Ørskov",
    image: "/assets/images/people/stig.jpg",
    specialty: "Media",
    bio: "Stig brings extensive leadership in news media as incoming CEO of the World Association of News Publishers (WAN-IFRA). He's led Denmark's largest news publishing house for 12 years.",
  },
  {
    name: "Christian Lindholm",
    image: "/assets/images/christian-lindholm.jpg",
    specialty: "Design",
    bio: "Christian is the inventor of the Navi Key user interface used on more than 600M phones. He is the father of Series 60 used on more than 250M early smartphones.",
  },
  {
    name: "Madeleine Gummer von Mohl",
    image: "/assets/images/people/madeleine.jpg",
    specialty: "Ecosystem",
    bio: "Madeleine is founder and CEO of betahaus, one of Europe's largest networks of co-working spaces. Now Managing Partner at XTR Capital.",
  },
  {
    name: "Olof Schybergson",
    image: "/assets/images/people/olof-s.jpeg",
    specialty: "Digital Products and Business Design",
    bio: "Olof co-founded and led Fjord, the global design business acquired by Accenture. A pioneer in design and innovation.",
  },
  {
    name: "Marko Ahtisaari",
    image: "/assets/images/people/marko.jpg",
    specialty: "Societal",
    bio: "A Finnish technology entrepreneur and design leader. Marko has been CEO and co-founder of two technology companies: Dopplr and the Sync Project. He was also EVP of design at Nokia.",
  },
];

const foundingDonors = [
  {
    name: "Steffen Fagerström Christensen",
    bio: "European programmer and entrepreneur behind TwentyThree, the european player in the global video space.",
  },
  {
    name: "Martin von Haller Grønbæk",
    bio: "Pioneering European digital lawyer, thinker, investor and entrepreneur that spent the last decades at global tech lawfirm Bird & Bird.",
  },
  {
    name: "Jens Martin Skibsted",
    bio: "Visionary entrepreneur, author and designer. Has founded and shaped European design-led brands, such as Biomega.",
  },
  {
    name: "Niels Hartvig",
    bio: "European programmer and entrepreneur behind the global open source project Umbraco.",
  },
  {
    name: "Thomas Madsen-Mygdal",
    bio: "Entrepreneur and designer who spent the last 30 years building European startups, designing pioneering digital products and building platforms to move the digital world forward.",
  },
];

export default function PeoplePage() {
  return (
    <Layout title="People" description="The people supporting and driving the catalyst">
      <section class="lg:pt-xl pt-0 md:pb-2xl">
        <header class="mb-sm md:mb-xl text-center w-full">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">People</h1>
        </header>
      </section>

      <section class="pb-6xl">
        <div class="max-w-[1400px] mx-auto">
          <div class="mb-xl mt-xl md:mt-0">
            <img
              src="/assets/images/people/core.jpg"
              alt="Margrethe Vestager, Thomas Madsen-Mygdal and Ditte Graa Wulff"
              class="w-full h-auto object-cover"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-xl mb-3xl md:mb-5xl">
            <div>
              <h3 class="text-xl md:text-3xl font-normal mb-md">
                Thomas Madsen-Mygdal, Founder &amp; Chairperson
              </h3>
              <p class="text-base md:text-xl">
                Entrepreneur and designer. Spent the last 30 years building European startups,
                designing pioneering digital products, and building platforms to move the digital
                world forward.
              </p>
            </div>
            <div>
              <h3 class="text-xl md:text-3xl font-normal mb-md">Margrethe Vestager, Patron</h3>
              <p class="text-base md:text-xl">
                Former Executive VP of the EU Commission and Commissioner of Competition, World
                leader Fellow at Blavatnik Institute. Chair of the board of DTU.
              </p>
            </div>
          </div>

          {/* Ambassadors */}
          <section class="pb-6xl">
            <h2 class="text-4xl md:text-5xl font-normal mb-xl">Ambassadors</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2xl gap-y-xl lg:gap-y-4xl">
              <For each={ambassadors}>
                {(person) => (
                  <div>
                    <div class="w-full aspect-square bg-muted mb-md overflow-hidden">
                      <img
                        src={person.image}
                        alt={person.name}
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 class="text-xl font-normal mb-xs">{person.name}</h3>
                    <p class="text-sm text-muted mb-sm">{person.specialty}</p>
                    <p class="text-sm">{person.bio}</p>
                  </div>
                )}
              </For>
            </div>
          </section>

          {/* Founding Donors */}
          <section class="px-lg py-xl lg:py-3xl md:px-2xl bg-dark text-blonde mb-3xl md:mb-6xl">
            <h2 class="text-2xl md:text-3xl lg:text-5xl font-normal mb-xl">Founding Supporters</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2xl gap-y-2xl">
              <For each={foundingDonors}>
                {(donor) => (
                  <div>
                    <h3 class="text-lg md:text-2xl font-bold mb-sm">{donor.name}</h3>
                    <p class="text-xs md:text-base">{donor.bio}</p>
                  </div>
                )}
              </For>
            </div>
            <p class="mt-3xl text-base">
              We thank our founding supporters who have provided the funding to start. If you're
              interested in supporting,{" "}
              <a class="underline" href="mailto:team@rebuild.net">
                contact us.
              </a>
            </p>
          </section>

          {/* Core Team */}
          <h2 class="text-4xl md:text-5xl font-normal mb-xl">Core team</h2>
          <p class="text-base md:text-xl">
            Ditte Graa Wulff
            <br />
            Morten Bjørn Hallkvist
            <br />
            Thomas Noppen
            <br />
            Antonia Baskakov
            <br />
            Lital Ströbel
          </p>
        </div>
      </section>
    </Layout>
  );
}
