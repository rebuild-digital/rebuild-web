import { createSignal, Show } from "solid-js";

const ENDPOINT = "https://rebuild-production.b-cdn.net/api/builder-promotion";

export default function BuilderPromoForm() {
  const [status, setStatus] = createSignal<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    setStatus("loading");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("success"); form.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div>
      <h2 class="text-2xl font-normal mb-sm">Suggest a platform</h2>
      <p class="text-muted mb-lg">Do you know of a social platform that should be in our directory?</p>

      <Show when={status() === "success"}>
        <div class="bg-green border-2 border-dark p-md">
          <p class="text-dark font-semibold">
            Thank you for the recommendation! We will review this platform for inclusion in our directory.
          </p>
        </div>
      </Show>

      <Show when={status() !== "success"}>
        <form onSubmit={handleSubmit} class="flex flex-col gap-sm">
          <div class="flex flex-col gap-xs">
            <label for="bp-name" class="text-sm font-medium">Platform name *</label>
            <input
              id="bp-name"
              type="text"
              name="builder_name"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
            <p class="text-xs text-muted">The name of the platform you want to share with us.</p>
          </div>

          <div class="flex flex-col gap-xs">
            <label for="bp-website" class="text-sm font-medium">Link to platform *</label>
            <input
              id="bp-website"
              type="url"
              name="builder_website"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="bp-why" class="text-sm font-medium">Why should they be in the directory? *</label>
            <textarea
              id="bp-why"
              name="why_promote"
              required
              rows="4"
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue resize-y"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="bp-your-name" class="text-sm font-medium">Your name</label>
            <input
              id="bp-your-name"
              type="text"
              name="your_name"
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
            <p class="text-xs text-muted">Optional: So we can contact you if we need more information.</p>
          </div>

          <div class="flex flex-col gap-xs">
            <label for="bp-email" class="text-sm font-medium">Your email</label>
            <input
              id="bp-email"
              type="email"
              name="your_email"
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex items-start gap-xs">
            <input
              type="checkbox"
              name="newsletter_signup"
              id="bp-newsletter"
              class="mt-1 w-6 h-6 border-2 border-dark flex-shrink-0"
            />
            <label for="bp-newsletter" class="text-sm text-dark">
              Yes, I'd like to receive newsletters and updates from Rebuild. I can unsubscribe at any time.
            </label>
          </div>

          <Show when={status() === "error"}>
            <p class="text-red text-sm">Sorry, we could not submit your suggestion. Please try again.</p>
          </Show>

          <button
            type="submit"
            disabled={status() === "loading"}
            class="px-md py-sm border-2 border-dark bg-dark text-light hover:bg-darker transition-fast text-left self-start disabled:opacity-50"
          >
            {status() === "loading" ? "Submitting..." : "Submit suggestion"}
          </button>
        </form>
      </Show>
    </div>
  );
}
