import Layout from "~/components/layout/Layout";
import { createAsync, cache } from "@solidjs/router";

// Server-side markdown loading for changelog
const getChangelog = cache(async () => {
  "use server";
  try {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const filePath = join(__dirname, "../../src/changelog.md");
    if (existsSync(filePath)) {
      return readFileSync(filePath, "utf-8");
    }
  } catch (e) {
    console.warn("Could not read changelog.md", e);
  }
  return null;
}, "changelog");

export default function ChangelogPage() {
  return (
    <Layout title="Changelog" description="What has changed in Rebuild.">
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl md:text-5xl lg:text-7xl">Changelog</h1>
        </header>
      </section>
      <div class="rich-text max-w-[700px] pb-6xl">
        <p class="text-muted">Updates and changes to the Rebuild platform and programme.</p>
      </div>
    </Layout>
  );
}
