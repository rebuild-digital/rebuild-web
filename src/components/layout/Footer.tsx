import { createSignal, For, Show } from "solid-js";
import site from "~/data/site";

const NEWSLETTER_ENDPOINT = "https://rebuild-production.b-cdn.net/api/newsletter-signup";

export default function Footer() {
  const [status, setStatus] = createSignal<"idle" | "loading" | "success" | "error">("idle");
  let fadeTimeout: ReturnType<typeof setTimeout> | undefined;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    setStatus("loading");

    try {
      const formData = new FormData(form);
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    // Auto-hide message after 3 seconds
    if (fadeTimeout) clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <footer class="max-w-[800px] lg:max-w-[1400px] mx-auto px-md pb-md">
      <div class="mx-auto pt-md">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-col">
            <div class="py-2 h-12">
              <img src={site.logo} alt="Rebuild logo." />
            </div>
            <p class="text-sm">{site.description}</p>

            {/* Newsletter signup */}
            <div class="text-sm mt-lg">
              <p class="text-sm mb-xs">
                Get our newsletter or{" "}
                <a
                  class="underline hover:text-blue"
                  href="https://linkedin.com/company/rebuild-europe"
                >
                  follow us on Linkedin
                </a>
              </p>
              <form
                onSubmit={handleSubmit}
                class="flex flex-col gap-xs mb-md"
              >
                <div class="flex flex-col gap-xs">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    class="px-sm py-xs border-2 border-dark text-sm focus:outline-none focus:ring-2 focus:ring-blue"
                  />
                  <div class="flex flex-col sm:flex-row gap-xs">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First name"
                      class="flex-1 px-sm py-xs border-2 border-dark text-sm focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last name"
                      class="flex-1 px-sm py-xs border-2 border-dark text-sm focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>
                  <select
                    name="interest"
                    required
                    class="px-sm py-xs border-2 border-dark text-sm focus:outline-none focus:ring-2 focus:ring-blue bg-light text-muted"
                  >
                    <option value="">Keep me up to date as...</option>
                    <option value="entrepreneur">an entrepreneur</option>
                    <option value="investor">an investor</option>
                    <option value="fund">a public fund manager</option>
                    <option value="media">a media representative</option>
                    <option value="curious">a curious individual</option>
                  </select>
                  <div class="my-4 flex items-center align-middle gap-xs">
                    <input
                      type="checkbox"
                      name="consent"
                      id="footer-consent"
                      required
                      class="mt-1 w-6 h-6 border-2 border-dark focus:ring-2 focus:ring-blue"
                    />
                    <label for="footer-consent" class="text-xs text-dark">
                      I consent to receive newsletters and updates from Rebuild. I can unsubscribe
                      at any time.
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={status() === "loading"}
                    class="text-sm px-sm py-xs border-2 border-dark bg-darker text-light hover:bg-dark text-left self-start disabled:opacity-50"
                  >
                    {status() === "loading" ? "Signing up..." : "Subscribe now"}
                  </button>
                </div>

                <Show when={status() === "success"}>
                  <div class="bg-green border-2 border-dark p-xs">
                    <p class="text-dark text-xs font-semibold">Thanks for subscribing!</p>
                  </div>
                </Show>
                <Show when={status() === "error"}>
                  <div class="bg-red text-light border-2 border-dark p-xs">
                    <p class="text-xs font-semibold">Something went wrong. Please try again.</p>
                  </div>
                </Show>
              </form>
            </div>
          </div>

          {/* Navigation */}
          <nav class="flex text-sm flex-row gap-xl mt-xl md:mt-0" aria-label="Footer Navigation">
            <ul class="flex flex-col gap-sm md:gap-md list-none md:flex-wrap md:justify-top">
              <For each={site.main_navigation}>
                {(item) => (
                  <li>
                    <a
                      href={item.url}
                      class="text-dark hover:underline transition-fast hover:text-blue focus:text-blue"
                    >
                      {item.name}
                    </a>
                  </li>
                )}
              </For>
            </ul>
            <ul class="flex text-xs flex-col gap-sm list-none md:flex-wrap md:justify-top">
              <For each={site.second_navigation}>
                {(item) => (
                  <li>
                    <Show
                      when={item.clickable}
                      fallback={<span class="text-muted cursor-not-allowed">{item.name}</span>}
                    >
                      <a
                        href={item.url}
                        class="hover:underline transition-fast hover:text-blue focus:text-blue"
                      >
                        {item.name}
                      </a>
                    </Show>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </div>

        <p class="text-dark text-xs mt-xl">
          &copy; {new Date().getFullYear()} {site.title} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
