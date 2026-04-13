import { createSignal, Show, onMount, onCleanup, lazy, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";

const formComponents: Record<string, any> = {
  "builder-promo": lazy(() => import("../forms/BuilderPromoForm")),
  "builder-application": lazy(() => import("../forms/BuilderApplicationForm")),
  newsletter: lazy(() => import("../forms/NewsletterForm")),
  "gathering-invitation": lazy(() => import("../forms/GatheringInvitationForm")),
};

export default function FormSidebar() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeForm, setActiveForm] = createSignal<string | null>(null);

  const open = (formType: string) => {
    setActiveForm(formType);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
    // Clear form after animation
    setTimeout(() => setActiveForm(null), 300);
  };

  onMount(() => {
    const handleClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest("[data-form]") as HTMLElement | null;
      if (trigger) {
        e.preventDefault();
        const formType = trigger.dataset.form;
        if (formType && formComponents[formType]) {
          open(formType);
        }
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen()) close();
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);

    onCleanup(() => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    });
  });

  return (
    <>
      {/* Mobile overlay */}
      <div
        class={`fixed inset-0 bg-dark bg-opacity-50 z-40 md:hidden transition-opacity duration-300${
          isOpen() ? "" : " hidden"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        class={`fixed top-0 right-0 h-full w-full md:w-[500px] lg:w-[600px] bg-light md:border-l-2 border-dark transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto overflow-x-hidden${
          isOpen() ? " translate-x-0" : " translate-x-full"
        }`}
        aria-label="Form sidebar"
        aria-hidden={!isOpen()}
      >
        <div class="h-full p-md md:p-lg" style="width: 100%; max-width: 100vw">
          {/* Close button */}
          <button
            class="absolute top-md right-md text-2xl leading-none hover:text-blue transition-colors z-10"
            aria-label="Close"
            onClick={close}
          >
            &times;
          </button>

          {/* Form content */}
          <div class="mt-2xl" style="width: 100%; max-width: 100%">
            <Show when={activeForm() && formComponents[activeForm()!]}>
              <Suspense fallback={<p class="text-muted">Loading form...</p>}>
                <Dynamic component={formComponents[activeForm()!]} />
              </Suspense>
            </Show>
          </div>
        </div>
      </aside>
    </>
  );
}
