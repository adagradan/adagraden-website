/**
 * Verified facts from the Constitution [CONST], Certificate [CERT] and CAC
 * Status Report [STATUS] — transcribed from information-bank.md §3, §5, §6.
 * Wording of the aims is verbatim (sentence case). Do not paraphrase claims
 * beyond what is written here.
 */

export type Aim = {
  text: string;
  /** Programme this aim maps to (information-bank.md §4). */
  programSlug: string;
  /** True when the source text is incomplete (open item #1). */
  incomplete?: boolean;
};

/** CONST Art. 3 — Aims and objectives. */
export const aims: Aim[] = [
  {
    text: "To acquire land and establish training facilities for teaching practical skills, including modern agricultural/farm work, hair plaiting, knitting, sewing, and various handiworks.",
    programSlug: "skills-training",
  },
  {
    text: "To offer medical aid, financial support, and care for individuals suffering from critical or chronic illnesses, including cancer, leukemia, and prostate issues.",
    programSlug: "medical-aid",
  },
  {
    text: "To provide financial relief, welfare packages, and monthly stipends/pension-like assistance to the elderly and vulnerable senior citizens.",
    programSlug: "elderly-care",
  },
  {
    text: "To cater to the welfare, social, and physical needs of orphans, widows, widowers, abandoned children, and destitute individuals in society.",
    programSlug: "family-welfare",
  },
  {
    // Verbatim: the registered constitution ends this objective mid-word ("…BY PROVIDIN").
    text: "To support underprivileged, abandoned, and destitute children by providing…",
    programSlug: "education",
    incomplete: true,
  },
  {
    text: "To empower less privileged men, women, single mothers, and single fathers by helping them establish small businesses, engage in petty trading, and gain financial independence.",
    programSlug: "livelihoods",
  },
];

export type Milestone = { date: string; dateTime?: string; title: string; text: string; upcoming?: boolean };

/** Verified dated events only (CERT, STATUS). */
export const milestones: Milestone[] = [
  {
    date: "29 Sep 2026",
    dateTime: "2026-09-29",
    title: "Our Foundation Begins",
    text: "Ada Gradan Compassionate Care Hands Foundation is formally established as a not-for-profit, non-political organisation.",
  },
  {
    date: "29 Sep 2026",
    dateTime: "2026-09-29",
    title: "Trustees Appointed",
    text: "Our Chairman and our Secretary were appointed as the Foundation's first trustees.",
  },
  {
    date: "31 Dec 2026",
    dateTime: "2026-12-31",
    title: "Our First Accounts",
    text: "We close our first financial year and prepare our accounts for independent audit.",
    upcoming: true,
  },
];

/**
 * CONST Art. 7 — governing body. Names exactly as registered on the CAC
 * Certificate and Status Report (29 Sep 2026); no honorifics or bios, which
 * are unconfirmed. Personal contact details are never published.
 * Portraits supplied by the client (16–17 Nov 2026); 720×900 AVIF, 4:5.
 */
export const governingRoles: {
  role: string;
  note: string;
  name: string | null;
  initials: string;
  photo?: { src: string; blurDataURL: string };
}[] = [
  {
    role: "Chairman",
    note: "Trustee",
    name: "Jacinta Ada Obijiaku",
    initials: "JO",
    photo: {
      src: "/trustees/jacinta-ada-obijiaku.avif",
      blurDataURL:
        "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoKAA0AA4BaJQBOgMXIzotU5K2AAP7Km3+BOCwVQt4l22Zxua6I6wF1Rm2UX5aoW6Hb1Hzz47iO0Uq+YOnPz3quM/jg99FfQJ/S5hgAAAA=",
    },
  },
  {
    role: "Secretary",
    note: "Trustee",
    name: "Blessing Ngozichukwu Uzoeto",
    initials: "BU",
    photo: {
      src: "/trustees/blessing-ngozichukwu-uzoeto.avif",
      blurDataURL:
        "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAABQAgCdASoKAA0AA4BaJagCdAYsPTQ6+gcuCPAA/pw8yX0/18Ny7Ua8PClxIRGO+3/HkScKrUvZnxN9ZMsXEKP6qdiGP0DtdG3BYl+uqEOPcdeQn0ecD9UYf9mXEyRmBPOABSui8b1qLf9tm7krFhaAAAA=",
    },
  },
];

/** CONST Arts. 4, 5, 6, 12. */
export const governanceFacts = [
  { label: "Trustees", text: "Between 2 and 15 trustees, elected at a General Meeting by a two-thirds majority of members present." },
  { label: "Terms", text: "Each trustee serves a term of up to five years." },
  { label: "Meetings", text: "General, Executive, Emergency and Annual General Meetings, with a quorum of one third of members." },
];

/** CONST Art. 8 — sources of income. */
export const incomeSources = [
  "Freewill donations and contributions from members",
  "Grants and aid from individuals, corporate bodies or government agencies",
  "Fundraising events and community projects",
  "Membership levies and other lawful means",
];
