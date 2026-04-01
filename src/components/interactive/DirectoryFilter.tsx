import { createSignal, createMemo, For, Show } from "solid-js";
import type { Builder } from "~/data/builders";
import { getCategoryColors, sortCategories } from "~/lib/categoryColors";

interface DirectoryFilterProps {
  builders: Builder[];
}

export default function DirectoryFilter(props: DirectoryFilterProps) {
  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());
  const [tooltipOpen, setTooltipOpen] = createSignal(false);

  const categories = createMemo(() => {
    const set = new Set<string>();
    props.builders.forEach((b) => b.category.forEach((c) => set.add(c)));
    return sortCategories(Array.from(set));
  });

  const visibleBuilders = createMemo(() => {
    const filters = activeFilters();
    if (filters.size === 0) return props.builders;
    return props.builders.filter((b) =>
      Array.from(filters).some((f) => b.category.includes(f))
    );
  });

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const isActive = (category: string) => activeFilters().has(category);

  return (
    <div class="mb-3xl">
      {/* Directory Header */}
      <section class="md:pt-xl mb-lg lg:mb-4xl">
        <div class="flex flex-col lg:flex-row gap-md">
          <div class="flex-col lg:w-1/2">
            <h1 class="font-normal mb-sm lg:mb-0 text-4xl md:text-5xl lg:text-7xl">
              Social Platform Directory
            </h1>

            {/* Tooltip */}
            <div class="relative mt-md">
              <button
                class="inline-flex items-center gap-xs text-lg text-dark hover:underline cursor-pointer"
                aria-label="Show more information"
                onClick={(e) => { e.stopPropagation(); setTooltipOpen((v) => !v); }}
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke-width="2" />
                  <path d="M12 16v-4M12 8h.01" stroke-width="2" stroke-linecap="round" />
                </svg>
                <span>What is this?</span>
              </button>

              <Show when={tooltipOpen()}>
                <div class="absolute top-full left-0 mt-xs z-10 bg-light border-2 border-dark p-md">
                  <div class="flex lg:w-[55ch] flex-col gap-md text-lg leading-tight text-dark">
                    <p>
                      We are mapping all the social platforms in Europe. Our directory is growing
                      based on input from people all around Europe. It is a collective piece of work.
                      The platforms mapped are here because someone told us about their existence or
                      directed us to a list, where they were mentioned. All are mapped as precisely
                      as possible based on publicly available information.
                    </p>
                    <p>
                      Is there a platform we should know about, or some information that should be
                      adjusted? Let us know
                    </p>
                  </div>
                </div>
              </Show>
            </div>
          </div>

          {/* CTAs */}
          <div class="flex justify-end gap-sm md:gap-md md:w-1/2 h-16 md:h-20 leading-tight">
            <button
              data-form="builder-application"
              class="inline-block px-sm md:px-lg py-xs bg-dark border-2 border-dark text-light hover:underline transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue cursor-pointer"
            >
              Join the directory
            </button>
            <button
              data-form="builder-promo"
              class="inline-block px-sm md:px-lg py-xs md:py-md bg-transparent border-2 border-dark text-dark hover:underline transition-all duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue cursor-pointer"
            >
              Suggest a platform
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Show when={props.builders.length > 0}>
        <section class="mt-xl">
          <div class="w-full lg:w-2/3">
            <p class="text-sm text-muted">Filter by category</p>
            <div class="mt-lg mb-lg" id="category-filters-wrapper">
              <div class="flex gap-xs flex-wrap" id="category-filters">
                <For each={categories()}>
                  {(category) => {
                    const colors = getCategoryColors(category);
                    return (
                      <button
                        class={`filter-button${isActive(category) ? ` ${colors.bg} ${colors.text}` : ""}`}
                        onClick={() => toggleFilter(category)}
                        aria-pressed={isActive(category)}
                      >
                        <span>{category}</span>
                        <Show when={isActive(category)}>
                          <span class="filter-x">&times;</span>
                        </Show>
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>
        </section>
      </Show>

      {/* Builders Grid */}
      <section class="mt-0 mb-xl">
        <Show
          when={props.builders.length > 0}
          fallback={
            <div class="rich-text">
              <p>No platforms available. This is definitely an error.</p>
            </div>
          }
        >
          <div class="builders-masonry columns-1 md:columns-2 lg:columns-3 gap-xs" style="column-gap: 0.5rem;">
            <For each={visibleBuilders()}>
              {(builder) => (
                <div class="break-inside-avoid mb-xs">
                  <BuilderRow builder={builder} />
                </div>
              )}
            </For>
          </div>
        </Show>
      </section>
    </div>
  );
}

function BuilderRow({ builder }: { builder: Builder }) {
  const hasImage = () => builder.imageUrl && builder.imageUrl.length > 0;

  return (
    <div
      class="builder-row flex items-start gap-sm p-sm border-t-2 border-dark hover:bg-blonde-tint transition-colors"
      data-categories={builder.category.join(",")}
    >
      <Show when={hasImage()}>
        <div class="flex-shrink-0 w-12 h-12">
          <img
            src={builder.imageUrl}
            alt={builder.name}
            class="w-12 h-12 object-cover border border-dark"
            loading="lazy"
          />
        </div>
      </Show>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-xs">
          <h3 class="text-base font-normal leading-tight">
            <Show
              when={builder.link}
              fallback={<span>{builder.name}</span>}
            >
              <a
                href={builder.link}
                target="_blank"
                rel="noopener noreferrer"
                class="text-dark hover:underline"
              >
                {builder.name}
              </a>
            </Show>
          </h3>
          <Show when={builder.country.length > 0}>
            <span class="text-xs text-muted flex-shrink-0">{builder.country[0]}</span>
          </Show>
        </div>
        <Show when={builder.description}>
          <p class="text-sm text-muted mt-xxs leading-tight">{builder.description}</p>
        </Show>
        <Show when={builder.category.length > 0}>
          <div class="flex gap-xxs flex-wrap mt-xs">
            <For each={builder.category}>
              {(cat) => {
                const colors = getCategoryColors(cat);
                return (
                  <span
                    class={`inline-block px-xs py-xxs text-xs border border-dark ${colors.bg} ${colors.text}`}
                  >
                    {cat}
                  </span>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
