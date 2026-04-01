import { For, Show } from "solid-js";
import Layout from "~/components/layout/Layout";
import jobsData from "~/data/jobs.json";

interface Job {
  id: string;
  title: string;
  content: string;
  active: boolean;
}

export default function OpenPositionsPage() {
  const activeJobs = (jobsData.jobs as Job[]).filter((j) => j.active);

  return (
    <Layout
      title="Open positions"
      description="Rebuild is a twelve-month sprint for European social platforms. We're always open for volunteers and people looking to contribute."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Open positions</h1>
        </header>
      </section>

      <div class="pb-6xl max-w-[700px]">
        <Show
          when={activeJobs.length > 0}
          fallback={
            <div class="rich-text">
              <p class="text-muted">There are currently no open positions. Check back soon.</p>
              <p>
                If you're passionate about European social platforms and want to get involved,{" "}
                <a href="/get-in-touch">get in touch</a>.
              </p>
            </div>
          }
        >
          <div class="flex flex-col gap-2xl">
            <For each={activeJobs}>
              {(job) => (
                <article class="border-t-2 border-dark pt-lg">
                  <h2 class="text-xl md:text-2xl font-normal mb-lg">{job.title}</h2>
                  <div class="rich-text" innerHTML={job.content} />
                </article>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Layout>
  );
}
