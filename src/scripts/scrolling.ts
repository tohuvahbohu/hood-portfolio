/**
 * Smooth scroll (Lenis) + GSAP ScrollTrigger for desktop sticky storytelling.
 * Respects prefers-reduced-motion. Mobile uses normal stacked flow.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const DESKTOP_MQ = "(min-width: 960px)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MQ).matches;
}

function isDesktop(): boolean {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function initReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!nodes.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  nodes.forEach((el) => io.observe(el));
}

function initLenis(): Lenis | null {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initStickyStudies(): ScrollTrigger[] {
  const triggers: ScrollTrigger[] = [];
  if (!isDesktop() || prefersReducedMotion()) {
    document.querySelectorAll(".sticky-study__aside").forEach((el) => {
      el.classList.remove("is-sticky-enabled");
    });
    return triggers;
  }

  document.querySelectorAll<HTMLElement>(".sticky-study").forEach((section) => {
    const aside = section.querySelector<HTMLElement>(".sticky-study__aside");
    const panels = section.querySelectorAll<HTMLElement>(".panel");
    if (!aside || !panels.length) return;

    aside.classList.add("is-sticky-enabled");

    panels.forEach((panel) => {
      const st = ScrollTrigger.create({
        trigger: panel,
        start: "top 75%",
        end: "bottom 35%",
        onEnter: () => panel.classList.add("is-active"),
        onEnterBack: () => panel.classList.add("is-active"),
        onLeave: () => panel.classList.remove("is-active"),
        onLeaveBack: () => panel.classList.remove("is-active"),
      });
      triggers.push(st);

      gsap.fromTo(
        panel,
        { opacity: 0.45, y: 16 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.6,
          },
        },
      );
    });
  });

  return triggers;
}

function initHeroTransition(): void {
  if (prefersReducedMotion() || !isDesktop()) return;
  const hero = document.querySelector<HTMLElement>(".hero");
  const outcomes = document.querySelector<HTMLElement>("#outcomes");
  if (!hero || !outcomes) return;

  gsap.fromTo(
    hero.querySelectorAll(".hero__content > *"),
    { y: 0, opacity: 1 },
    {
      y: -24,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

function handleAnchorClicks(lenis: Lenis | null): void {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    event.preventDefault();
    if (lenis && !prefersReducedMotion()) {
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
    history.pushState(null, "", id);
  });
}

export function initScrolling(): void {
  document.documentElement.classList.add("js-ready");

  gsap.registerPlugin(ScrollTrigger);

  const lenis = initLenis();
  initReveal();
  initHeroTransition();
  initStickyStudies();
  handleAnchorClicks(lenis);

  const refresh = () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    initStickyStudies();
    ScrollTrigger.refresh();
  };

  window.matchMedia(DESKTOP_MQ).addEventListener("change", refresh);
  window.matchMedia(REDUCED_MQ).addEventListener("change", () => {
    window.location.reload();
  });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initScrolling());
  } else {
    initScrolling();
  }
}
