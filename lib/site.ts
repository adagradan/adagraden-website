/**
 * Organisation facts. Every value here comes from information-bank.md.
 * Anything not verified there is a clearly marked placeholder — do not
 * replace a placeholder without a verified source (rules.md §13).
 */

export const org = {
  name: "Ada Gradan Compassionate Care Hands Foundation",
  legalName: "ADA GRADAN COMPASSIONATE CARE HANDS FOUNDATION",
  shortWordmark: "Ada Gradan",
  wordmarkSub: "Compassionate Care Hands Foundation",
  cacNumber: "9898701",
  taxId: "2621642447107",
  registeredOn: "29 September 2026",
  registeredYear: "2026",
  foundingDate: "2026-09-29",
  address: {
    lines: [
      "No. 8 Chukwuma Ekezie Street, off Mbieri Road",
      "Akwakuma (by Luxury Place Guest House)",
      "Owerri, Imo State, Nigeria",
    ],
    street: "No. 8 Chukwuma Ekezie Street, off Mbieri Road, Akwakuma",
    locality: "Owerri",
    region: "Imo State",
    country: "NG",
  },
  /**
   * Official public contact details — information-bank.md open items #2, #3,
   * #12. Leave as null until the Foundation confirms them; the site hides
   * these lines (and points visitors to the contact form) while they are null.
   * Never use the trustees' personal emails or phone numbers here.
   */
  email: null as string | null,
  phone: null as string | null,
  social: [] as { label: string; href: string }[],

  /** information-bank.md §8 — Derived, approved */
  metaDescription:
    "A Nigerian non-profit caring for orphans, widows, single parents, the elderly and the critically ill through education, skills, livelihoods and medical aid.",
  /** information-bank.md §8 — Derived. "across our community" pending open item #7 */
  footerBlurb:
    "Ada Gradan Compassionate Care Hands Foundation is a non-profit in Owerri, Imo State, supporting vulnerable children, families, the elderly and the sick across our community.",
  /** information-bank.md §3 — Derived draft mission statement */
  mission:
    "To care for the most vulnerable people in our communities, including orphans, widows, single parents, the elderly and the critically ill, through education, skills training, livelihood support, welfare and medical assistance.",
  /** information-bank.md §6 — Derived, approved */
  transparency:
    "Our constitution requires every naira received to be applied solely to our charitable objectives, with accounts independently audited each year.",
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Programmes", href: "/programs" },
  { label: "News", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const donateHref = "/donate";

/** Verified beneficiary groups, condensed for display (information-bank.md §4) */
export const beneficiaryHighlights = [
  "Orphans",
  "Widows",
  "Single parents",
  "The elderly",
  "The critically ill",
] as const;
