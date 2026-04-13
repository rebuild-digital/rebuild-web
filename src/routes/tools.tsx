import Layout from "~/components/layout/Layout";
import { For } from "solid-js";

const tools = [
  {
    version: "v0.8.5",
    title: "Social Design Framework",
    description:
      "The Social Design Framework for platform entrepreneurs captures the key elements of any platform. Updated in a more actionable version by the initiative working group led by Martin Sønderlev during Rebuild 1.",
    thumbnail: "/assets/images/frameworks/social design framework.png",
    thumbnailAlt: "Social Design Framework",
    secondaryAction: { text: "Read more", url: "/insights/social-design-framework/" },
  },
  {
    version: "v0.8",
    title: "Social Platform Taxonomy",
    description:
      "Social platforms take many shapes. Many more than today's monopoly situation lets us believe. The Social Platform taxonomy is a step in unbundling and navigating the landscape.",
    thumbnail: "/assets/images/frameworks/social-platform-taxonomy.png",
    thumbnailAlt: "Social Platform Taxonomy",
    secondaryAction: null,
  },
  {
    version: "v0.8",
    title: "Social Platform Models",
    description:
      "Rebuilding Europe's social platforms through diversity. This is a first attempt at indexing the numerous different models the future of social platforms rests upon.",
    thumbnail: "/assets/images/frameworks/social-platform-models.png",
    thumbnailAlt: "Social Platform Models",
    secondaryAction: null,
  },
  {
    version: "v0.8",
    title: "Social Scale",
    description:
      "Visualising the need to think social platforms all across the scale. From the most intimate relationships in our lives to the infrastructure our continent rests upon.",
    thumbnail: "/assets/images/frameworks/social-scale.png",
    thumbnailAlt: "Social Scale",
    secondaryAction: null,
  },
];

export default function ToolsPage() {
  return (
    <Layout
      title="Tools"
      description="We need more qualified ways to grasp social platforms. Therefore, we're sharing working models and tools for the entire industry to work with, use, challenge and qualify."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Tools</h1>
        </header>
        <p class="text-muted max-w-[55ch]">
          We need more qualified ways to grasp social platforms. Therefore, we're sharing working
          models and tools for the entire industry to work with, use, challenge and qualify.
        </p>
      </section>

      <hr class="border-dark border-t-2 mb-xl" />

      <section class="py-4xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <For each={tools}>
            {(tool) => (
              <div class="border-2 border-dark p-lg">
                <img
                  src={tool.thumbnail}
                  alt={tool.thumbnailAlt}
                  class="w-full h-48 object-contain mb-lg bg-light"
                  loading="lazy"
                />
                <div class="flex items-center gap-sm mb-sm">
                  <h2 class="text-xl font-normal">{tool.title}</h2>
                  <span class="text-xs text-muted border border-muted px-xs py-xxs">
                    {tool.version}
                  </span>
                </div>
                <p class="text-sm text-muted mb-md">{tool.description}</p>
                {tool.secondaryAction && (
                  <a href={tool.secondaryAction.url} class="text-sm underline hover:text-blue">
                    {tool.secondaryAction.text}
                  </a>
                )}
              </div>
            )}
          </For>
        </div>
      </section>

      <div class="mt-3xl pb-6xl">
        <h2 class="text-4xl">
          What tool do you wish existed?
          <br />
          <a class="underline" href="mailto:frameworks@rebuild.net">
            Let us know
          </a>
          .
        </h2>
      </div>
    </Layout>
  );
}
