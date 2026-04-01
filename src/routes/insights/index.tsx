import Layout from "~/components/layout/Layout";
import InsightsFilter from "~/components/interactive/InsightsFilter";
import { getAllInsights } from "~/lib/collections";

export default function InsightsPage() {
  const insights = getAllInsights();

  return (
    <Layout
      title="Insights"
      description="Our growing library of insights. Stories from early founders, current entrepreneurs, and insights from the Rebuild journey."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Insights</h1>
        </header>
        <hr class="border-dark border-t-2 mb-xl" />
        <InsightsFilter insights={insights} />
      </section>
    </Layout>
  );
}
