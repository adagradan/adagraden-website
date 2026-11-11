import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { donateHref } from "@/lib/site";
import { Logo } from "./Logo";
import { DesktopNav, DesktopNavList, MobileMenu, MobileMenuFallback } from "./Nav";

/**
 * Reference layout: logo | divider + stacked contact lines … nav on the right.
 * Contact lines show verified facts only; no organisation phone/email is
 * confirmed yet (information-bank.md open items #2, #3).
 */
export function Header() {
  // No backdrop-filter on the header: it would become the containing block
  // for the fixed mobile-menu panel and collapse it.
  return (
    <header className="site-header sticky top-0 z-50 h-(--header-h) border-b border-line bg-surface">
      <Container className="flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-10 xl:gap-24">
          <Logo compact />
          <div className="hidden border-l border-ink/60 pl-3 text-micro leading-relaxed text-muted xl:block">
            <p>Owerri, Imo State, Nigeria</p>
            <p>Non-profit · Non-political</p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <nav aria-label="Main" className="hidden lg:block">
            <Suspense fallback={<DesktopNavList pathname={null} />}>
              <DesktopNav />
            </Suspense>
          </nav>
          <div className="hidden sm:block">
            <Button href={donateHref} size="sm" variant="dark" className="whitespace-nowrap">
              Donate
            </Button>
          </div>
          <ThemeToggle />
          <Suspense fallback={<MobileMenuFallback />}>
            <MobileMenu />
          </Suspense>
        </div>
      </Container>
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent text-on-accent" />
    </header>
  );
}
