import Layout from "~/components/layout/Layout";

export default function ChangelogPage() {
  return (
    <Layout
      title="Changelog"
      description="The digital platform changelog, where we keep you up to date about what we're improving."
    >
      <section class="pt-xl pb-2xl">
        <header class="mb-xl">
          <h1 class="font-normal text-4xl">Changelog</h1>
        </header>
      </section>

      <div class="rich-text max-w-[700px] pb-6xl">
        <h4>v0.9.87 - January 22, 2026</h4>
        <ul>
          <li>New callout for Rebuild 1 on the landing page</li>
          <li>Random ordering on the directory entries</li>
          <li>Subtle pulse animation on our beta tag in the header</li>
        </ul>

        <h4>v0.9.7 - January 12, 2026</h4>
        <ul>
          <li>
            Update to the directory in order to support the growing number of platforms in it! The
            directory now has...
          </li>
          <li>Category filters, allowing you to view only a single, or multiple categories.</li>
          <li>Consistent tag coloring</li>
          <li>Tooltip with explanation</li>
          <li>Three column masonry grid on desktop</li>
          <li>More compact and scannable design</li>
          <li>Also, fixed typos across several pages.</li>
        </ul>

        <h4>v0.9.6 - December 21, 2025</h4>
        <ul>
          <li>
            Newsletter checkboxes now sign you up directly to our service (instead of manual
            imports).
          </li>
          <li>Loads of form simplifications, both UX, copy and backend.</li>
          <li>General form styling consistency.</li>
          <li>Also, rolled back the versions on the changelog to v0.9 ... it's beta, after all.</li>
        </ul>

        <h4>v0.9.5 - December 18, 2025</h4>
        <ul>
          <li>Added open positions page, incl. in footer</li>
          <li>Added student positions</li>
        </ul>

        <h4>v0.9.4 - December 17, 2025</h4>
        <ul>
          <li>Styling upgrades for insights on mobile</li>
          <li>Final edits to Daniela story</li>
        </ul>

        <h4>v0.9.3 - December 17, 2025</h4>
        <ul>
          <li>Added changelog</li>
          <li>Removed demo pages</li>
          <li>Updated DN story</li>
          <li>Initial jobs page work</li>
        </ul>

        <h4>v0.9.2 - December 16, 2025</h4>
        <ul>
          <li>Individual subpages for all forms + improved language</li>
          <li>Remove featured property from posts</li>
          <li>Added TMM post and true masonry insights</li>
          <li>Better spacing in insights grid</li>
          <li>Updated positioning in site description</li>
          <li>Typos on homepage and journey.</li>
          <li>Also MV was listed twice as a Keynote speaker!</li>
        </ul>

        <h4>v0.9.1 - December 16, 2025</h4>
        <ul>
          <li>Lots of small fixes</li>
          <li>Updated taxonomy to say "social marketplaces", consistency is king</li>
          <li>No more authors in the insights feed for now</li>
          <li>But image credits on /about images</li>
        </ul>

        <h4>v0.9.0 - December 15, 2025</h4>
        <ul>
          <li>Initial launch. What a day.</li>
        </ul>
      </div>
    </Layout>
  );
}
