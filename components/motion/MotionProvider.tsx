"use client";

import { useEffect } from "react";

/**
 * One observer for the whole site (no per-component client boundaries):
 *  - [data-reveal]  → sets [data-inview] the first time it enters the viewport
 *  - [data-count]   → counts its number up from 0 when revealed
 *  - scroll state   → html[data-scrolled], html[data-scroll-dir="down"]
 * New nodes added by client-side navigation are picked up automatically.
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    (window as Window & { __motionReady?: boolean }).__motionReady = true;
    const motionOn = root.dataset.motion === "on";

    /* ---------- reveals ---------- */
    const pending = new Set<Element>();
    const reveal = (el: Element) => {
      pending.delete(el);
      el.setAttribute("data-inview", "");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
      if (el instanceof HTMLElement && el.dataset.count !== undefined) countUp(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          reveal(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    const watch = (scope: ParentNode) => {
      scope.querySelectorAll("[data-reveal]:not([data-inview])").forEach((el) => {
        if (motionOn) {
          pending.add(el);
          io.observe(el);
        } else reveal(el);
      });
    };

    /* Safety net: a fast fling can jump an element past the viewport without
       it ever "intersecting", and the last elements on the page may never
       reach the observer's threshold. Reveal anything already entered/passed,
       and everything once the page bottom is reached. */
    const sweep = () => {
      if (!pending.size) return;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      for (const el of pending) {
        if (atBottom || el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          io.unobserve(el);
          reveal(el);
        }
      }
    };
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]:not([data-inview])")) {
            if (motionOn) {
              pending.add(n);
              io.observe(n);
            } else reveal(n);
          }
          watch(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* ---------- header scroll state ---------- */
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        root.toggleAttribute("data-scrolled", y > 8);
        if (Math.abs(y - lastY) > 6) {
          const down = y > lastY && y > 480 && document.body.style.overflow !== "hidden";
          if (down) root.dataset.scrollDir = "down";
          else delete root.dataset.scrollDir;
          lastY = y;
        }
        sweep();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

/** Ease a numeric text node from 0 to its value (keeps any non-digit suffix). */
function countUp(el: HTMLElement) {
  if (el.dataset.counted) return;
  el.dataset.counted = "true";
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  if (document.documentElement.dataset.motion !== "on") {
    el.textContent = String(target);
    return;
  }
  const duration = 1600;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
