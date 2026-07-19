/**
 * Mobile nav toggle + current-page highlighting.
 * Keyboard accessible; does not trap focus incorrectly.
 */

export function initNavigation(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const nav = document.querySelector<HTMLElement>("[data-nav-list]");
  if (!toggle || !nav) return;

  const setOpen = (open: boolean) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Mark current page for aria-current
  const path = window.location.pathname.replace(/\/$/, "/") || "/";
  nav.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    try {
      const url = new URL(link.href, window.location.origin);
      const linkPath = url.pathname.replace(/\/$/, "/") || "/";
      if (linkPath === path || (path.startsWith("/work/") && linkPath === "/work/")) {
        if (!url.hash) link.setAttribute("aria-current", "page");
      }
    } catch {
      /* ignore invalid hrefs */
    }
  });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initNavigation());
  } else {
    initNavigation();
  }
}
