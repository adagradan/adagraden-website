#!/usr/bin/env node
/**
 * Donation-account watchdog.
 *
 * Loads the LIVE Donate page and every script it ships, exactly as a donor's
 * browser would, and checks the bank accounts against a trusted list kept
 * outside the code (a GitHub secret). Fails — and emails the trustees — if
 * anything differs. Catches a tampered commit, a compromised host, a hijacked
 * domain or an injected script alike.
 *
 *   SITE_URL=https://example.org \
 *   EXPECTED_ACCOUNTS="NGN=5601837641,USD=5250622151,GBP=5250622522,EUR=5250622498" \
 *   EXPECTED_ACCOUNT_NAME="Ada Gradan Compassionate Care Hands Foundation" \
 *   node scripts/check-donation-accounts.mjs
 *
 * Optional alert email (Resend): RESEND_API_KEY, MAIL_FROM, ALERT_EMAILS (comma-separated).
 */

const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");
const expected = Object.fromEntries(
  (process.env.EXPECTED_ACCOUNTS ?? "")
    .split(",")
    .map((p) => p.split("=").map((x) => x.trim()))
    .filter(([k, v]) => k && v),
);
const expectedName = (process.env.EXPECTED_ACCOUNT_NAME ?? "").trim();

// Standard library constants that legitimately appear in JS bundles.
const BENIGN = new Set(["0123456789", "2147483647", "4294967295"]);

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": "donation-accounts-watchdog" }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

async function check() {
  const problems = [];
  if (!site) throw new Error("SITE_URL is not set.");
  if (Object.keys(expected).length !== 4) throw new Error("EXPECTED_ACCOUNTS must list NGN, USD, GBP and EUR.");

  const pageUrl = `${site}/donate`;
  const html = await get(pageUrl);
  const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => new URL(m[1], pageUrl).href))];
  if (!scripts.length) problems.push("The Donate page loaded no scripts — the page may have been replaced.");

  // Every script must come from the site itself.
  for (const s of scripts) if (new URL(s).origin !== new URL(pageUrl).origin) problems.push(`Unexpected external script on the Donate page: ${s}`);

  const code = html + "\n" + (await Promise.all(scripts.map(get))).join("\n");

  // 1) Each currency is paired with its own trusted account.
  for (const [cur, acct] of Object.entries(expected)) {
    const found = [...code.matchAll(new RegExp(`${cur}\\s*:\\s*["'](\\d{6,20})["']`, "g"))].map((m) => m[1]);
    if (!found.length) problems.push(`${cur}: account not found on the live site (expected ${acct}).`);
    for (const f of found) if (f !== acct) problems.push(`${cur}: live site shows ${f}, expected ${acct}.`);
  }

  // 2) No unknown account-like (10-digit) numbers anywhere donors can see.
  const trusted = new Set(Object.values(expected));
  const tokens = new Set([...code.matchAll(/(?<![0-9.])(\d{10})(?![0-9])/g)].map((m) => m[1]));
  for (const t of tokens) if (!trusted.has(t) && !BENIGN.has(t)) problems.push(`Unknown 10-digit number on the Donate page: ${t}`);

  // 3) The account name donors are told to check.
  if (expectedName && !code.includes(expectedName)) problems.push(`Account name "${expectedName}" not found on the live site.`);

  return { problems, scripts: scripts.length };
}

async function alert(subject, text) {
  const { RESEND_API_KEY: key, MAIL_FROM: from, ALERT_EMAILS: to } = process.env;
  if (!key || !from || !to) return console.log("(No alert email configured; relying on the failed-run notification.)");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, text }),
  });
  console.log(res.ok ? "Alert email sent." : `Alert email failed: HTTP ${res.status}`);
}

try {
  const { problems, scripts } = await check();
  if (problems.length) {
    const text = `The donation account check FAILED for ${site}/donate\n\n${problems.map((p) => `• ${p}`).join("\n")}\n\nIf you did not just change the bank details, treat this as an emergency: take the Donate page down and check GitHub and the hosting account.`;
    console.error(text);
    await alert("⚠️ URGENT: donation account details changed on the website", text);
    process.exit(1);
  }
  console.log(`OK — ${site}/donate shows the trusted accounts for NGN, USD, GBP and EUR (${scripts} scripts checked).`);
} catch (e) {
  const text = `The donation account check could not run for ${site}/donate:\n\n${e instanceof Error ? e.message : e}`;
  console.error(text);
  await alert("Donation account check could not run", text);
  process.exit(1);
}
