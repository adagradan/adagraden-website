/**
 * Programme pillars — information-bank.md §4.
 * Titles are working names; descriptions stay within the verified scope
 * of each source objective (CONST Art. 3 + STATUS principal activity).
 */

import { photos, type Photo } from "./media";

export type Program = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  imagePlaceholder: string;
  /** Illustrative photo conveying the programme's story (see lib/media.ts). */
  image?: Photo;
  /** Who it serves — verified scope only (information-bank.md §4). */
  serves: string[];
  /** What it provides — verified scope only (information-bank.md §4). */
  provides: string[];
};

export const programs: Program[] = [
  {
    slug: "skills-training",
    image: photos.skillsSewing,
    title: "Skills & Vocational Training",
    shortTitle: "Skills Training",
    summary:
      "We aim to establish training facilities that teach practical skills: modern farming, hair plaiting, knitting, sewing and handiwork.",
    imagePlaceholder: "consented photo of a skills or vocational training session",
    serves: ["Orphans, widows, single parents and other people our foundation serves"],
    provides: ["Land and training facilities", "Modern agricultural and farm work", "Hair plaiting", "Knitting and sewing", "Various handiworks"],
  },
  {
    slug: "medical-aid",
    image: photos.medicalCare,
    title: "Medical Aid & Care",
    shortTitle: "Medical Aid",
    summary:
      "Medical aid, financial support and care for people living with critical or chronic illnesses, including cancer, leukemia and prostate conditions.",
    imagePlaceholder: "consented photo of medical support or care",
    serves: ["People with critical or chronic illnesses", "Including cancer, leukemia and prostate conditions"],
    provides: ["Medical aid", "Financial support", "Care"],
  },
  {
    slug: "elderly-care",
    image: photos.elderlyWoman,
    title: "Elderly Care & Stipends",
    shortTitle: "Elderly Care",
    summary:
      "Financial relief, welfare packages and monthly stipends for elderly and vulnerable senior citizens.",
    imagePlaceholder: "consented photo of an elderly beneficiary",
    serves: ["Elderly and vulnerable senior citizens"],
    provides: ["Financial relief", "Welfare packages", "Monthly stipends and pension-like assistance"],
  },
  {
    slug: "family-welfare",
    image: photos.familyMotherChild,
    title: "Orphans, Widows & Vulnerable Families",
    shortTitle: "Family Welfare",
    summary:
      "Caring for the welfare, social and physical needs of orphans, widows, widowers, abandoned children and destitute individuals.",
    imagePlaceholder: "consented photo of a family welfare activity",
    serves: ["Orphans", "Widows and widowers", "Abandoned children", "Destitute individuals"],
    provides: ["Care for welfare needs", "Care for social needs", "Care for physical needs"],
  },
  {
    slug: "education",
    image: photos.educationClassroom,
    title: "Children's Education Support",
    shortTitle: "Children's Education",
    summary:
      "Educational support for underprivileged, abandoned and destitute children.",
    imagePlaceholder: "consented photo of children in a learning setting",
    serves: ["Underprivileged children", "Abandoned children", "Destitute children"],
    provides: ["Educational support"],
  },
  {
    slug: "livelihoods",
    image: photos.livelihoodShopkeeper,
    title: "Livelihood & Small Business Empowerment",
    shortTitle: "Livelihoods",
    summary:
      "Helping less privileged men and women, including single mothers and fathers, set up small businesses and petty trading towards financial independence.",
    imagePlaceholder: "consented photo of a small business or trader",
    serves: ["Less privileged men and women", "Single mothers", "Single fathers"],
    provides: ["Help to establish small businesses", "Support to engage in petty trading", "A path to financial independence"],
  },
];
