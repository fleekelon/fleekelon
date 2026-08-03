import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Site-wide scroll animation system.
 *
 * Usage from markup:
 * - `data-reveal`            fade/slide the element in when it enters the viewport
 * - `data-reveal-stagger`    reveal direct children one after another
 * - `data-counter="42"`      count a numeral up from 0 when visible
 */
export function initScrollAnimations(): void {
  gsap.registerPlugin(ScrollTrigger);

  // Frosted-glass header once the hero is scrolled past.
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (header) {
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  for (const el of reveals) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onComplete: () => el.classList.add("is-revealed"),
    });
  }

  const staggers = gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]");
  for (const group of staggers) {
    const children = Array.from(group.children);
    gsap.from(children, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: "top 82%", once: true },
    });
  }

  const counters = gsap.utils.toArray<HTMLElement>("[data-counter]");
  for (const el of counters) {
    const target = Number(el.dataset.counter ?? "0");
    const decimals = Number(el.dataset.counterDecimals ?? "0");
    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = state.value.toFixed(decimals);
      },
    });
  }
}
