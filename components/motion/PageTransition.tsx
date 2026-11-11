import { ViewTransition, type ReactNode } from "react";

/**
 * Wrap each page's content (in page.tsx, not the layout — layouts persist, so
 * enter/exit never fire there). On client-side navigation the old page lifts
 * away and the new one sweeps up into place; see "NAVIGATION" in globals.css.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
