import { createSignal, For, onMount, onCleanup } from "solid-js";
import { useLocation } from "@solidjs/router";
import site from "~/data/site";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [isTransparent, setIsTransparent] = createSignal(false);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  // Header scroll transparency (for homepage)
  onMount(() => {
    const handleScroll = () => {
      // Only transparent when at top of homepage-style pages
      setIsTransparent(window.scrollY < 50 && document.body.dataset.homepage === "true");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  return (
    <header
      class={`fixed z-50 w-full top-0 left-0 pt-md transition-all duration-300 bg-light${isTransparent() ? " transparent" : ""}`}
    >
      <div class="container max-w-[1400px] mx-auto px-md">
        <div class="h-16 flex justify-between items-center gap-lg md:gap-sm border-b-2 pb-md">
          <div class="flex gap-sm">
            <div class="w-auto self-center">
              <a href="/">
                <img src={site.logo} alt="Rebuild logo." />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" class="hidden lg:block">
            <ul class="flex gap-md list-none md:flex-wrap md:justify-center md:gap-sm">
              <For each={site.main_navigation}>
                {(item) => (
                  <li>
                    <a
                      href={item.url}
                      class="no-underline hover:underline px-sm last:pl-0 py-xs transition-fast"
                      aria-current={location.pathname === item.url ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            class="lg:hidden text-dark flex items-center gap-xs text-lg font-normal bg-transparent border-none cursor-pointer p-0"
            aria-expanded={menuOpen()}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
          >
            <span>{menuOpen() ? "Close" : "Menu"}</span>
            <span class="text-2xl leading-none align-top pb-1" aria-hidden="true">
              {menuOpen() ? "\u00d7" : "+"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        class={`fixed inset-0 bg-muted z-50 lg:hidden${menuOpen() ? "" : " hidden"}`}
        aria-hidden={!menuOpen()}
      >
        <div class="container max-w-[1400px] mx-auto px-md py-lg">
          {/* Mobile Menu Header */}
          <div class="flex justify-between items-center border-b-2 border-dark pb-md mb-lg">
            <a href="/" class="text-xl text-dark no-underline" onClick={closeMenu}>
              {site.title}
            </a>
            <button
              class="text-dark flex items-center gap-xs text-lg font-normal bg-transparent border-none cursor-pointer p-0"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              <span>Close</span>
              <span class="text-2xl leading-none" aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav aria-label="Mobile navigation" class="mt-3xl">
            <ul class="list-none flex flex-col gap-md">
              <For each={site.main_navigation}>
                {(item) => (
                  <li>
                    <a
                      href={item.url}
                      class={`text-dark text-4xl no-underline block transition-fast hover:text-blue focus:text-blue${location.pathname === item.url ? " text-blue" : ""}`}
                      aria-current={location.pathname === item.url ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* Secondary Navigation in Mobile Menu */}
          <nav
            aria-label="Secondary navigation"
            class="mt-2xl pt-lg border-b-2 border-dark pb-lg"
          >
            <ul class="list-none flex gap-lg flex-wrap">
              <For each={site.second_navigation}>
                {(item) => (
                  <li>
                    <a
                      href={item.url}
                      class={`text-dark text-xl no-underline transition-fast hover:text-blue focus:text-blue${location.pathname === item.url ? " text-blue" : ""}`}
                      aria-current={location.pathname === item.url ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
