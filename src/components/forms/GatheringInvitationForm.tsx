import { createSignal, Show } from "solid-js";

const ENDPOINT = "https://rebuild-production.b-cdn.net/api/gathering-invitation";

export default function GatheringInvitationForm() {
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
      <h2 class="text-2xl font-normal mb-sm">Request an invitation</h2>
      <p class="text-muted mb-lg">
        Rebuild gatherings bring together the entrepreneurs, investors, and digital leaders building
        the next generation of European social platforms.
      </p>

      <Show when={status() === "success"}>
        <div class="bg-green border-2 border-dark p-md">
          <p class="text-dark font-semibold">
            Thank you for your interest! We will review your request and be in touch.
          </p>
        </div>
      </Show>

      <Show when={status() !== "success"}>
        <form onSubmit={handleSubmit} class="flex flex-col gap-sm">
          <div class="flex flex-col sm:flex-row gap-sm">
            <div class="flex flex-col gap-xs flex-1">
              <label for="gi-first" class="text-sm font-medium">First name *</label>
              <input
                id="gi-first"
                type="text"
                name="first_name"
                required
                class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div class="flex flex-col gap-xs flex-1">
              <label for="gi-last" class="text-sm font-medium">Last name *</label>
              <input
                id="gi-last"
                type="text"
                name="last_name"
                required
                class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
          </div>

          <div class="flex flex-col gap-xs">
            <label for="gi-email" class="text-sm font-medium">Email *</label>
            <input
              id="gi-email"
              type="email"
              name="email"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="gi-role" class="text-sm font-medium">Your role *</label>
            <input
              id="gi-role"
              type="text"
              name="role"
              required
              placeholder="e.g. Founder, Investor, Policy maker..."
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col gap-xs">
            <label for="gi-why" class="text-sm font-medium">Why do you want to attend? *</label>
            <textarea
              id="gi-why"
              name="motivation"
              required
              rows="4"
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue resize-y"
            />
          </div>

          <div class="flex items-start gap-xs">
            <input
              type="checkbox"
              name="newsletter_signup"
              id="gi-newsletter"
              class="mt-1 w-6 h-6 border-2 border-dark flex-shrink-0"
            />
            <label for="gi-newsletter" class="text-sm text-dark">
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
            {status() === "loading" ? "Submitting..." : "Request invitation"}
          </button>
        </form>
      </Show>
    </div>
  );
}
