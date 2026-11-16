# Security: protecting the donation account details

The bank account numbers on this site are public, so the goal is not to hide them but to make sure **nobody can quietly change them**. They live in one file, [`lib/donate.ts`](lib/donate.ts), are baked into the site at build time, and **cannot be changed from the running website** (not from the admin dashboard, a database or a form). Keep it that way.

The protections, in layers:

| Layer | What it stops | Status |
|---|---|---|
| Accounts only in code, no runtime edit path | Changing them through the website or admin | ✅ Built in |
| `CODEOWNERS` + branch protection | A change merging without a trustee's approval | ⚙️ Needs GitHub settings (step 1) |
| Daily watchdog (every 6 h) | Any change on the live site, by any route | ⚙️ Needs secrets (step 2) |
| Name check shown to donors | A swapped Naira account (the donor's bank shows the real name) | ✅ Built in |
| Content Security Policy + Subresource Integrity | Injected or tampered scripts | ✅ Built in |
| 2FA, domain lock, email authentication | Account, domain and email takeover | ⚙️ Needs account settings (steps 3–5) |

---

## 1. GitHub (most important)

1. **Require two-factor authentication** for the `adagradan` organisation: *Organisation › Settings › Authentication security › Require two-factor authentication*. Prefer security keys or passkeys over SMS.
2. **Create a `trustees` team** (*Organisation › Teams › New team*) and add the people who may approve changes to the bank details. [`.github/CODEOWNERS`](.github/CODEOWNERS) refers to `@adagradan/trustees`.
3. **Protect `main`**: *Repository › Settings › Rules › Rulesets › New branch ruleset*, target `main`, then enable:
   - Restrict deletions; Block force pushes
   - Require a pull request before merging: **1 approval**, **Require review from Code Owners**, Dismiss stale approvals when new commits are pushed
   - Leave the bypass list **empty**, so admins are covered too
4. Keep repository **admin** rights to as few people as possible. Admins can change secrets and rules.

## 2. Donation account watchdog

[`scripts/check-donation-accounts.mjs`](scripts/check-donation-accounts.mjs) loads the live Donate page and every script it ships, exactly as a donor's browser does, and compares the accounts with a trusted list kept **outside the code**. It runs every 6 hours ([workflow](.github/workflows/donation-accounts-watchdog.yml)). If anything differs, the run fails and the trustees are emailed.

Set these in *Repository › Settings › Secrets and variables › Actions*:

| Name | Type | Value |
|---|---|---|
| `SITE_URL` | Variable | `https://your-domain.org` |
| `EXPECTED_ACCOUNT_NAME` | Variable | `Ada Gradan Compassionate Care Hands Foundation` |
| `EXPECTED_ACCOUNTS` | **Secret** | `NGN=5601837641,USD=5250622151,GBP=5250622522,EUR=5250622498` |
| `ALERT_EMAILS` | Secret | Trustee emails, comma-separated |
| `RESEND_API_KEY`, `MAIL_FROM` | Secret | Same as the website's |

Then open *Actions › Donation account watchdog › Run workflow* once, and check that it passes.

> GitHub pauses scheduled workflows in repositories with no activity for 60 days. If the repository goes quiet, re-enable the workflow from the Actions tab.

Run it by hand at any time:
```sh
SITE_URL=https://your-domain.org EXPECTED_ACCOUNTS="NGN=…,USD=…,GBP=…,EUR=…" node scripts/check-donation-accounts.mjs
```

## 3. Hosting (Vercel / Railway)

- 2FA for every member, and as few members as possible.
- Deploy production **only from `main`**, so every live change has passed branch protection.
- Turn on deployment notifications, so an unexpected deploy is noticed.

## 4. Domain

- Registrar account: 2FA, and turn on **registrar lock** (transfer lock).
- Turn on **DNSSEC** if the registrar and DNS host support it.
- Use a contact email for the registrar that the trustees control.

## 5. Email (stops fake "transfer details" emails)

On the domain used for `MAIL_FROM`:
- **SPF** and **DKIM**: add the records Resend shows when you verify the domain.
- **DMARC**: start with `v=DMARC1; p=quarantine; rua=mailto:<a trustee address>`. After a few weeks of clean reports, move to `p=reject`.

---

## Changing the bank details (the only legitimate way)

1. Open a pull request that edits `lib/donate.ts`.
2. A trustee reviews and approves it (CODEOWNERS enforces this).
3. Merge, and wait for the deploy.
4. **Update the `EXPECTED_ACCOUNTS` secret** to the new numbers, then run the watchdog by hand.

Until step 4 is done the watchdog will raise an alarm, which is intended: a change nobody told the trustees about should never pass quietly.

## If the watchdog raises an alarm

1. Assume it is real until proven otherwise.
2. Take the Donate page offline (redeploy the last good commit, or pause the deployment).
3. Check GitHub (recent commits, members, rulesets), the hosting account (deploys, members, environment variables) and the domain's DNS records.
4. Rotate passwords and API keys for any account that might be affected.
5. If donors may have been affected, contact them through the admin dashboard's donor emails.

## Technical notes

- **Content Security Policy** ([`next.config.ts`](next.config.ts)): scripts may only come from this site; frames only from Google Maps; forms only to this site and Flutterwave; the site can't be framed by others. `'unsafe-inline'` is needed for scripts because Next.js streams page data in inline scripts on prerendered pages; nonces would force every page to render dynamically. External script injection is still blocked.
- **Subresource Integrity** (`experimental.sri`): every JavaScript file carries a SHA-256 hash, and browsers refuse a file that doesn't match.
- **Dependencies**: Dependabot ([`.github/dependabot.yml`](.github/dependabot.yml)) opens weekly update PRs. Deploys should use `npm ci` with the committed lockfile.

To report a security problem, email the trustees privately. Do not open a public issue.
