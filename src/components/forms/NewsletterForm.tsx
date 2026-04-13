import { createSignal, Show } from "solid-js";

const ENDPOINT = "https://rebuild-production.b-cdn.net/api/newsletter-signup";

export default function NewsletterForm() {
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
      <h2 class="text-2xl font-normal mb-sm">Stay Updated</h2>
      <p class="text-muted mb-lg">Get updates about new platforms, insights and gatherings.</p>

      <Show when={status() === "success"}>
        <div class="bg-green border-2 border-dark p-md mb-lg">
          <p class="text-dark font-semibold">
            Thank you for subscribing! Check your email to confirm your subscription.
          </p>
        </div>
      </Show>

      <Show when={status() !== "success"}>
        <form onSubmit={handleSubmit} class="flex flex-col gap-sm">
          <div class="flex flex-col gap-xs">
            <label for="nl-email" class="text-sm font-medium">Email *</label>
            <input
              id="nl-email"
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-sm">
            <div class="flex flex-col gap-xs flex-1">
              <label for="nl-first" class="text-sm font-medium">First name</label>
              <input
                id="nl-first"
                type="text"
                name="first_name"
                placeholder="Jane"
                class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div class="flex flex-col gap-xs flex-1">
              <label for="nl-last" class="text-sm font-medium">Last name</label>
              <input
                id="nl-last"
                type="text"
                name="last_name"
                placeholder="Doe"
                class="px-sm py-xs border-2 border-dark focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
          </div>

          <div class="flex flex-col gap-xs">
            <label for="nl-interest" class="text-sm font-medium">I am... *</label>
            <select
              id="nl-interest"
              name="interest"
              required
              class="px-sm py-xs border-2 border-dark bg-light focus:outline-none focus:ring-2 focus:ring-blue"
            >
              <option value="">Keep me up to date as...</option>
              <option value="entrepreneur">an entrepreneur</option>
              <option value="investor">an investor</option>
              <option value="fund">a public fund manager</option>
              <option value="media">a media representative</option>
              <option value="curious">a curious individual</option>
            </select>
          </div>

          <div class="flex items-start gap-xs">
            <input
              type="checkbox"
              name="consent"
              id="nl-consent"
              required
              class="mt-1 w-6 h-6 border-2 border-dark flex-shrink-0"
            />
            <label for="nl-consent" class="text-sm text-dark">
              I agree to receive email updates and understand I can unsubscribe at any time.
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
            {status() === "loading" ? "Subscribing..." : "Subscribe now"}
          </button>
        </form>
      </Show>
    </div>
  );
}
