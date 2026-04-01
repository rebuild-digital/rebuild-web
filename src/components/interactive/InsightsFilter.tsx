import { createSignal, createMemo, For, Show } from "solid-js";
import type { Insight } from "~/lib/collections";
import { getTagColor } from "~/lib/categoryColors";
import { shortDate } from "~/lib/dateFormat";

interface InsightsFilterProps {
  insights: Insight[];
}

type SortMode = "recency" | "alphabetical";

export default function InsightsFilter(props: InsightsFilterProps) {
  const [activeTag, setActiveTag] = createSignal<string | null>(null);
  const [sortMode, setSortMode] = createSignal<SortMode>("recency");

  const allTags = createMemo(() => {
    const set = new Set<string>();
    props.insights.forEach((i) => i.frontmatter.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  });

  const visibleInsights = createMemo(() => {
    let filtered = props.insights;

    const tag = activeTag();
    if (tag) {
      filtered = filtered.filter((i) => i.frontmatter.tags?.includes(tag));
    }

    const sorted = [...filtered];
    if (sortMode() === "alphabetical") {
      sorted.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
      );
    }

    return sorted;
  });

  const toggleTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div>
      {/* Sort Controls */}
      <div class="flex items-center gap-md mb-lg">
        <span class="text-sm text-muted">Sort by:</span>
        <button
          class={`text-sm border-b-2 pb-xxs transition-fast${sortMode() === "recency" ? " border-dark" : " border-transparent hover:border-muted"}`}
          onClick={() => setSortMode("recency")}
          aria-pressed={sortMode() === "recency"}
        >
          Recency
        </button>
        <button
          class={`text-sm border-b-2 pb-xxs transition-fast${sortMode() === "alphabetical" ? " border-dark" : " border-transparent hover:border-muted"}`}
          onClick={() => setSortMode("alphabetical")}
          aria-pressed={sortMode() === "alphabetical"}
        >
          A–Z
        </button>
      </div>

      {/* Tag Filters */}
      <Show when={allTags().length > 0}>
        <div class="flex gap-xs flex-wrap mb-xl">
          <For each={allTags()}>
            {(tag) => {
              const colors = getTagColor(tag);
              return (
                <button
                  class={`inline-block px-sm py-xs border text-xs font-semibold transition-fast${
                    activeTag() === tag
                      ? ` ${colors.bg} ${colors.border} ${colors.text}`
                      : " bg-light border-muted text-muted hover:border-dark hover:text-dark"
                  }`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={activeTag() === tag}
                >
                  {tag}
                </button>
              );
            }}
          </For>
        </div>
      </Show>

      {/* Insights Grid */}
      <Show
        when={visibleInsights().length > 0}
        fallback={
          <p class="text-muted text-lg mt-xl">No insights found for this filter.</p>
        }
      >
        <div class="flex flex-col gap-lg" data-insights-grid>
          <For each={visibleInsights()}>
            {(insight) => <InsightCard insight={insight} />}
          </For>
        </div>
      </Show>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const fm = insight.frontmatter;

  return (
    <article
      class="border-t-2 border-dark pt-md"
      data-insight-card
      data-date={fm.date}
      data-title={fm.title}
      data-tags={fm.tags?.join(",") ?? ""}
    >
      <a href={`/insights/${insight.slug}`} class="no-underline group">
        <div class="flex flex-col md:flex-row gap-md">
          <Show when={fm.featured_image}>
            <div class="md:w-48 flex-shrink-0">
              <img
                src={fm.featured_image}
                alt={fm.title}
                class="w-full h-32 md:h-36 object-cover"
                loading="lazy"
              />
            </div>
          </Show>
          <div class="flex-1">
            <h2 class="text-xl md:text-2xl font-normal leading-tight mb-sm group-hover:underline">
              {fm.title}
            </h2>
            <Show when={fm.excerpt}>
              <p class="text-muted text-sm leading-tight mb-sm">{fm.excerpt}</p>
            </Show>
            <div class="flex items-center gap-sm flex-wrap">
              <span class="text-xs text-muted">{shortDate(fm.date)}</span>
              <Show when={fm.author}>
                <span class="text-xs text-muted">by {fm.author}</span>
              </Show>
              <Show when={fm.tags && fm.tags.length > 0}>
                <div class="flex gap-xxs flex-wrap">
                  <For each={fm.tags}>
                    {(tag) => {
                      const colors = getTagColor(tag);
                      return (
                        <span
                          class={`inline-block px-sm py-xs border ${colors.bg} ${colors.border} ${colors.text} text-xs font-semibold`}
                        >
                          {tag}
                        </span>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}
