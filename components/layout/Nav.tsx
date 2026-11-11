"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, ViewTransition } from "react";
import { donateHref, mainNav, org } from "@/lib/site";
import { Button } from "@/components/ui/Button";

function isActive(href: string, pathname: string | null) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/* ---------------------------------------------------------------- Desktop */

export function DesktopNavList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {mainNav.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group/nav relative inline-flex min-h-11 items-center px-3 text-meta font-medium transition-colors hover:text-ink ${
                active ? "text-ink" : "text-ink/75"
              }`}
            >
              {item.label}
              {active ? (
                /* Named: on navigation the underline glides to the new link. */
                <ViewTransition name="nav-indicator" share="nav-indicator">
                  <span aria-hidden="true" className="absolute inset-x-3 bottom-2.5 h-0.5 rounded-full bg-ink" />
                </ViewTransition>
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-2.5 h-0.5 origin-left scale-x-0 rounded-full bg-ink/30 transition-transform duration-300 group-hover/nav:scale-x-100"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DesktopNav() {
  return <DesktopNavList pathname={usePathname()} />;
}

/* ----------------------------------------------------------------- Mobile */

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const mq = window.matchMedia("(min-width: 64rem)");
    const onResize = () => mq.matches && close(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink lg:hidden"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="relative block h-3 w-4.5">
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-ink transition-transform duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-full rounded-full bg-ink transition-transform duration-300 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`}
          />
        </span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto border-t border-line bg-surface lg:hidden"
      >
        <nav aria-label="Main" className="mx-auto flex max-w-site flex-col px-5 pt-4 pb-10 sm:px-8">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => close(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-14 items-center justify-between text-card font-semibold"
                  >
                    {item.label}
                    {/* Shape marker, not text: on statically prerendered pages
                        (e.g. the 404) the server pathname can differ from the
                        browser's, and a text node would fail hydration.
                        aria-current carries the meaning for assistive tech. */}
                    <span
                      aria-hidden="true"
                      className={`h-1 w-6 rounded-full bg-accent transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-6">
            <Button href={donateHref} onClick={() => close(false)} className="self-start">
              Donate Now
            </Button>
            <address className="text-meta not-italic text-muted">
              {org.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </nav>
      </div>
    </>
  );
}

/** Pre-hydration / prerender fallback: visually identical, no active state. */
export function MobileMenuFallback() {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
    >
      <span className="relative block h-3 w-4.5">
        <span className="absolute top-0 left-0 block h-0.5 w-full rounded-full bg-ink" />
        <span className="absolute top-[10px] left-0 block h-0.5 w-full rounded-full bg-ink" />
      </span>
    </span>
  );
}
