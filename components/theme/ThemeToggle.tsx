"use client";

import { useRef, useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("themechange", onChange);
  };
}

const isDarkNow = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : window.matchMedia(QUERY).matches;
};

/**
 * Light / dark switch. The icon is chosen by CSS (no flash before hydration);
 * aria-pressed comes from a store that is false on the server and corrected
 * right after hydration. The choice is remembered in localStorage.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDarkNow, () => false);
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const root = document.documentElement;
    const next = isDarkNow() ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode: the choice simply isn't remembered */
      }
      window.dispatchEvent(new Event("themechange"));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }

    // The new theme spreads out in a circle from the toggle.
    const r = ref.current?.getBoundingClientRect();
    if (r) {
      root.style.setProperty("--theme-x", `${r.left + r.width / 2}px`);
      root.style.setProperty("--theme-y", `${r.top + r.height / 2}px`);
    }
    root.classList.add("theme-switching");
    document.startViewTransition(apply).finished.finally(() => root.classList.remove("theme-switching"));
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="group grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink"
    >
      <span className="sr-only">Dark theme</span>
      {/* Moon — shown in the light theme */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="theme-icon-moon size-[1.15rem] transition-transform duration-500 ease-out-soft group-hover:-rotate-12"
      >
        <path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
      </svg>
      {/* Sun — shown in the dark theme; its core is the brand yellow */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="theme-icon-sun size-5 transition-transform duration-700 ease-out-soft group-hover:rotate-90"
      >
        <circle cx="12" cy="12" r="4.5" className="fill-accent" />
        <path
          d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
