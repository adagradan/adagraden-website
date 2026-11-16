import type { Metadata } from "next";
import { Suspense } from "react";
import { Panel } from "@/components/admin/ui";
import { confirmSignInAction } from "../actions";

export const metadata: Metadata = { title: "Confirm sign-in", referrer: "no-referrer" };

/**
 * The email link lands here. Signing in needs a deliberate click (a POST), so
 * mail scanners that open links automatically can't use up the one-time token.
 */
async function Confirm({ searchParams }: { searchParams: PageProps<"/admin/auth">["searchParams"] }) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  return (
    <form action={confirmSignInAction} className="mt-8">
      <input type="hidden" name="token" value={token} />
      <button className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-button font-semibold text-on-accent transition-colors hover:bg-ink hover:text-on-ink">
        Continue to the dashboard
      </button>
    </form>
  );
}

export default function AuthPage(props: PageProps<"/admin/auth">) {
  return (
    <Panel className="mx-auto mt-6 max-w-md p-6 text-center sm:mt-12 sm:p-10">
      <h1 className="text-section font-medium">Almost there</h1>
      <p className="mt-2 text-meta text-muted">Confirm to sign in on this device.</p>
      <Suspense fallback={null}>
        <Confirm searchParams={props.searchParams} />
      </Suspense>
    </Panel>
  );
}
