import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mark } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getAdmin } from "@/lib/server/auth";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

async function SignedIn() {
  const admin = await getAdmin();
  if (!admin) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-micro text-muted sm:inline">{admin.email}</span>
      <form action={signOutAction}>
        <button className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-meta font-semibold transition-colors hover:border-ink">
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-alt">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Mark className="size-8" />
            <span className="text-body font-extrabold tracking-tight">
              Ada Gradan<span className="text-accent">.</span>
            </span>
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-micro font-semibold text-on-ink">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Suspense fallback={null}>
              <SignedIn />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-site px-5 py-8 sm:px-8 md:py-12">{children}</div>
      </main>
    </div>
  );
}
