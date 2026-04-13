import Layout from "~/components/layout/Layout";
import BuilderApplicationForm from "~/components/forms/BuilderApplicationForm";

export default function ApplyPage() {
  return (
    <Layout
      title="Join the directory"
      description="Are you building a social platform in Europe? Join our directory."
    >
      <section class="pb-6xl">
        <div class="max-w-[600px] mx-auto pt-xl">
          <BuilderApplicationForm />
        </div>
      </section>
    </Layout>
  );
}
