import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";
import Layout from "~/components/layout/Layout";
import DirectoryFilter from "~/components/interactive/DirectoryFilter";
import { getBuilders } from "~/data/builders";

export default function DirectoryPage() {
  const builders = createAsync(() => getBuilders());

  return (
    <Layout
      title="Social Platform Directory"
      description="We are mapping all the social platforms in Europe. This directory is growing every day based on input from people all around Europe."
    >
      <Suspense fallback={<div class="py-xl text-muted">Loading directory...</div>}>
        <DirectoryFilter builders={builders() ?? []} />
      </Suspense>
    </Layout>
  );
}
