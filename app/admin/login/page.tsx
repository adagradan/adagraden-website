import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Panel, SetupNotice } from "@/components/admin/ui";
import { adminSetupProblems, getAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Sign in" };

async function LinkError({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  if ((await searchParams).error !== "link") return null;
  return (
    <p role="alert" className="mb-6 rounded-card border border-danger/40 p-4 text-meta text-danger">
      That sign-in link has expired or was already used. Please request a new one.
    </p>
  );
}

async function LoginContent({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  await connection(); // settings are read at request time, not baked in at build
  const problems = adminSetupProblems();
  if (problems.length) return <SetupNotice problems={problems} />;
  if (await getAdmin()) redirect("/admin");
  return (
    <Panel className="mx-auto mt-6 max-w-md p-6 sm:mt-12 sm:p-10">
      <h1 className="text-section font-medium">Sign in</h1>
      <p className="mt-2 mb-8 text-meta text-muted">We will email you a one-time link. No password needed.</p>
      <LinkError searchParams={searchParams} />
      <LoginForm />
    </Panel>
  );
}

export default function LoginPage(props: PageProps<"/admin/login">) {
  return (
    <Suspense fallback={null}>
      <LoginContent searchParams={props.searchParams} />
    </Suspense>
  );
}
