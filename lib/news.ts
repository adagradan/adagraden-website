/**
 * "In the News": real, published reporting on the causes the Foundation
 * serves. These are NOT stories about the Foundation, and nothing here may be
 * worded as if the Foundation was involved. Each item was opened and checked
 * on the date below; summaries are our neutral paraphrase, attributed to the
 * people quoted in the article. Replace or add items by checking the source
 * first (rules.md §13).
 */

export const newsCheckedOn = "11 November 2026";

export type ExternalArticle = {
  headline: string;
  outlet: string;
  date: string;
  dateTime: string;
  url: string;
  /** Short neutral summary, with attribution. */
  summary: string;
  /** The cause it relates to, shown as a tag. */
  cause: string;
  /** Programme it gives context for (lib/programs.ts). */
  programSlug: string;
};

export const externalNews: ExternalArticle[] = [
  {
    headline: "One in four Nigerian girls out of school – UNICEF",
    outlet: "Vanguard",
    date: "19 Oct 2026",
    dateTime: "2026-10-19",
    url: "https://www.vanguardngr.com/2026/10/one-in-four-nigerian-girls-out-of-school-unicef/",
    summary:
      "Speaking on the International Day of the Girl Child, a UNICEF education officer said one in every four Nigerian girls remains out of school, and nearly three-quarters lack basic literacy and numeracy.",
    cause: "Children's education",
    programSlug: "education",
  },
  {
    headline: "2026 UN Day of Older Persons: Senior citizens want monthly stipends, free transport",
    outlet: "Vanguard",
    date: "3 Oct 2026",
    dateTime: "2026-10-03",
    url: "https://www.vanguardngr.com/2026/10/2026-un-day-of-older-persons-senior-citizens-want-monthly-stipends-free-transport/",
    summary:
      "At an event for the International Day of Older Persons, the convener of Global Veterans urged governments to budget for monthly stipends, free transport and welfare centres for older Nigerians.",
    cause: "The elderly",
    programSlug: "elderly-care",
  },
  {
    headline: "300 widows receive empowerment in Owerri",
    outlet: "Vanguard",
    date: "7 Mar 2026",
    dateTime: "2026-03-07",
    url: "https://www.vanguardngr.com/2026/03/300-widows-receive-empowerment-in-owerri/",
    summary:
      "More than 300 widows and vulnerable women across the Owerri Zone received food and cash support, with community leaders describing it as timely help for women facing hardship after losing their spouses.",
    cause: "Widows",
    programSlug: "family-welfare",
  },
  {
    headline: "Nigeria: Cancer and the Cost of Survival",
    outlet: "Daily Trust (via allAfrica)",
    date: "10 Feb 2026",
    dateTime: "2026-02-10",
    url: "https://allafrica.com/stories/202602100232.html",
    summary:
      "A Daily Trust editorial for World Cancer Day notes that Nigeria has about 15 functional radiotherapy machines against a need of at least 120, leaving many patients struggling with the cost of care.",
    cause: "The critically ill",
    programSlug: "medical-aid",
  },
];

export const newsFor = (programSlug: string) => externalNews.find((a) => a.programSlug === programSlug);
