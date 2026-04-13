import { useParams, createAsync, cache } from "@solidjs/router";
import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import Layout from "~/components/layout/Layout";
import { getAllInsights, getInsightBySlug } from "~/lib/collections";
import { dateFormat } from "~/lib/dateFormat";

// Cache the insights lookup by slug for prerendering
const getInsight = cache((slug: string) => {
  return Promise.resolve(getInsightBySlug(slug));
}, "insight");

export default function InsightPost() {
  const params = useParams();
  const insight = createAsync(() => getInsight(params.slug));

  return (
    <Show
      when={insight()}
      fallback={
        <Layout title="Not Found">
          <div class="rich-text py-xl">
            <h1>Insight not found</h1>
            <p>
              <a href="/insights">Back to insights</a>
            </p>
          </div>
        </Layout>
      }
    >
      {(post) => (
        <Layout
          title={post().frontmatter.title}
          description={post().frontmatter.excerpt}
          featuredImage={post().frontmatter.featured_image}
        >
          <article class="pb-6xl">
            <header class="mb-xl pt-xl">
              <h1 class="font-normal text-4xl md:text-5xl lg:text-6xl leading-tight mb-md">
                {post().frontmatter.title}
              </h1>
              <div class="flex items-center gap-md text-muted text-sm">
                <time dateTime={post().frontmatter.date}>
                  {dateFormat(post().frontmatter.date)}
                </time>
                <Show when={post().frontmatter.author}>
                  <span>by {post().frontmatter.author}</span>
                </Show>
              </div>
            </header>

            <div class="rich-text max-w-[700px]">
              <Dynamic component={post().content} />
            </div>

            <footer class="mt-xl pt-lg border-t-2 border-dark">
              <a href="/insights" class="text-sm underline hover:text-blue">
                ← Back to insights
              </a>
            </footer>
          </article>
        </Layout>
      )}
    </Show>
  );
}
