import { createSignal, Show } from "solid-js";

const ENDPOINT = "https://rebuild-production.b-cdn.net/api/builder-application";

export default function BuilderApplicationForm() {
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
      <h2 class="text-2xl font-normal mb-sm">Join the directory</h2>
      <p class="text-muted mb-lg">Apply to have your platform listed in the Rebuild directory.</p>

      <Show when={status() === "success"}>
        <div class="bg-green border-2 border-dark p-md">
          <p class="text-dark font-semibold">
            Thank you for your application! We will review it and get back to you soon.
          </p>
        </div>
      </Show>

      <Show when={status() !== "success"}>
        <form onSubmit={handleSubmit} class="flex flex-col gap-sm">
          <div class="flex flex-col gap-xs">
            <label for="ba-platform" class="text-sm font-medium">Platform name *</label>
            <input
              id="ba-platform"
              type="text"
              name="platform_name"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="ba-website" class="text-sm font-medium">Platform website *</label>
            <input
              id="ba-website"
              type="url"
              name="platform_website"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="ba-description" class="text-sm font-medium">Short description *</label>
            <textarea
              id="ba-description"
              name="platform_description"
              required
              rows="3"
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue resize-y"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="ba-contact-name" class="text-sm font-medium">Your name *</label>
            <input
              id="ba-contact-name"
              type="text"
              name="contact_name"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="ba-contact-email" class="text-sm font-medium">Your email *</label>
            <input
              id="ba-contact-email"
              type="email"
              name="contact_email"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex items-start gap-xs">
            <input
              type="checkbox"
              name="newsletter_signup"
              id="ba-newsletter"
              class="mt-1 w-6 h-6 border-2 border-dark flex-shrink-0"
            />
            <label for="ba-newsletter" class="text-sm text-dark">
              Yes, I'd like to receive newsletters and updates from Rebuild. I can unsubscribe at any time.
            </label>
          </div>

          <Show when={status() === "error"}>
            <p class="text-red text-sm">Something went wrong. Please try again.</p>
          </Show>

          <button
            type="submit"
            disabled={status() === "loading"}
            class="px-md py-sm border-2 border-dark bg-dark text-light hover:bg-darker transition-fast text-left self-start disabled:opacity-50"
          >
            {status() === "loading" ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </Show>
    </div>
  );
}
