import Layout from "~/components/layout/Layout";

export default function OpenPositionsPage() {
  return (
    <Layout title="Open Positions" description="Open positions at Rebuild.">
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Open Positions</h1>
        </header>
      </section>
      <div class="rich-text max-w-[700px] pb-6xl">
        <p class="text-muted">There are currently no open positions. Check back soon.</p>
        <p>
          If you're passionate about European social platforms and want to get involved,{" "}
          <a href="/get-in-touch">get in touch</a>.
        </p>
      </div>
    </Layout>
  );
}
