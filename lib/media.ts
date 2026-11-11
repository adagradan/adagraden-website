/**
 * Site photography. Generated from Unsplash originals, encoded as AVIF
 * (quality 62, 4:4:4 chroma) with tiny blur previews.
 *
 * These are illustrative photos licensed under the Unsplash License (free for
 * commercial use, no attribution required — credits kept as good practice).
 * They do NOT show the Foundation's own beneficiaries or activities, so alt
 * text and captions must never claim they do. Replace with real, consented
 * photos of the Foundation's work as they become available
 * (information-bank.md open item #10).
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  /** CSS object-position — keeps the subject in frame when cropped. */
  position: string;
  /** Override for tall/portrait crops, when the subject sits elsewhere. */
  portraitPosition?: string;
  credit: { name: string; url: string };
};

export const photos = {
  heroMotherAndChild: {
    src: "/images/hero-mother-and-child.avif",
    alt: "A mother in a patterned headwrap holds her sleeping baby close",
    width: 2400,
    height: 1600,
    blurDataURL: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAsAA4BaJQBOgBk/j9a02bAA/ukDkeiQMkCqKUvs2evs3BY+K0QxOoH5auziWBsC5fuIlP7lG1im4ikIwTtGEl3UIJkdXnSMAA==",
    position: "center 35%",
    credit: { name: "Annie Spratt", url: "https://unsplash.com/photos/yrzBgqapG1I" },
  },
  childrenSmiling: {
    src: "/images/children-smiling.avif",
    alt: "Three young girls sitting together, smiling",
    width: 800,
    height: 534,
    blurDataURL: "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoQAAsAA4BaJQBOgCHPZ1vS0AD0c3PzzSSoeA0slF2GJV/9xLOAISGqrIDje5tObHeeMJvmarjNsENaupUJt0hOUk4m1jsCTJCg48jAWAA=",
    position: "center 40%",
    credit: { name: "Lisa Marie Theck", url: "https://unsplash.com/@lisamarietheck" },
  },
  communityWomen: {
    src: "/images/community-women.avif",
    alt: "Women in colourful wrappers and headwraps gathered together outdoors",
    width: 1600,
    height: 1065,
    blurDataURL: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQAAsAA4BaJZgCdAYu5dvefTSQAP7c/Bu8H1WNfkCVgJfSukYhPeKGp89j+PWVt4PyEEHkOn7gF+etce9grqBeZgr4mUtVkH7Zo1xpGSjM3Gk7eoFQgAAA",
    position: "center",
    credit: { name: "Annie Spratt", url: "https://unsplash.com/photos/SPS796v4KmM" },
  },
  skillsSewing: {
    src: "/images/skills-sewing.avif",
    alt: "Two women in patterned dresses sewing fabric together at a machine",
    width: 1200,
    height: 1800,
    blurDataURL: "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAABQBACdASoQABgAPu1iqU2ppaOiMAgBMB2JQAB8pUHCa4GO0MiA1fM1nfcAAP7y19onE4KDOC8LmNj9XW74C1malx0ydFBgeMk9QRv52T0zS72BsE8F9VCg5Bv9rydu0qdUOfJlwqkF93b2Q9Ldc2O0jdrTL+GYPpkBErZ2+t029OehW3QaXfvwpoMu1koAqLiQoM40Sdz6g3SWouqQAA==",
    position: "center 40%",
    credit: { name: "Unsplash", url: "https://unsplash.com/photos/KK1SKkRfk1c" },
  },
  medicalCare: {
    src: "/images/medical-care.avif",
    alt: "A doctor with a stethoscope attends to a young girl at a clinic desk",
    width: 1200,
    height: 800,
    blurDataURL: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQAAsAA4BaJZgCdAEDYWfzbn7z2AD+7/Icp3a1SrPc7tIiuhPnzPbxTeQExNuw8Ch4ELUVO1iqC0yc2RCoML0/qnklWUUvoul0RmG7UNB8SAAA",
    position: "72% center",
    portraitPosition: "30% center",
    credit: { name: "Francisco Ven\u00e2ncio", url: "https://unsplash.com/@franciscovenancio" },
  },
  elderlyWoman: {
    src: "/images/elderly-woman.avif",
    alt: "An elderly woman in a headscarf and patterned dress, seated among her community",
    width: 1200,
    height: 2134,
    blurDataURL: "data:image/webp;base64,UklGRtIAAABXRUJQVlA4IMYAAABwBACdASoQABwAPu1iqU2ppaOiMAgBMB2JZgCdAdwLhAPR7hArgvhnaylogAD+wUAB8adhiQWfHh6vLNZsN8NzCHxRe3Z7CRIVTyApkhnQlKmE/S6vIAYPLdFI7uIph2yhx+Mcx/ntvR/OGUswhoC/3WMIjlrJhELPkhXpxh7owt0lsokfHoG7HeAW7cCtEUkV6G87U/IvfwUqFePy35goV1G0S9sjjocY3CA24qttoQDnZwsjgIsXF4B9DZHi07qKjCEAAAA=",
    position: "center 25%",
    credit: { name: "Blake Cheek", url: "https://unsplash.com/photos/AmVLNyrXTjw" },
  },
  familyMotherChild: {
    src: "/images/family-mother-child.avif",
    alt: "A mother in a headwrap smiles warmly at her young son",
    width: 1200,
    height: 767,
    blurDataURL: "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABwAgCdASoQAAoAA4BaJbACdAYuRoC+6lGcBh+gAP6wIO849rHu4Y/HMJ/0WGmojkJlOoWChdpP71B4Qmqp9ck5y1hBjt+bfZhLtW7GNkThiy7642nxrwaB2MlUov1F3lec4FZMeJV5mwAA",
    position: "center",
    credit: { name: "Moses Sichach", url: "https://unsplash.com/photos/AdWkBmVCB9Q" },
  },
  educationClassroom: {
    src: "/images/education-classroom.avif",
    alt: "Schoolchildren in uniform working at their desks in a classroom in Lagos",
    width: 1200,
    height: 675,
    blurDataURL: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQAAkAA4BaJYgCdAD0DaNlyAAA/tBv2CYL6Cq/81RRR9YNLosEUSDuTS/10fuU5tOijRRsmNw3d8hpsWXI2WXud/q0qQmZSY7eIUMJDVBqhwAA",
    position: "center",
    credit: { name: "Doug Linstedt", url: "https://unsplash.com/photos/jEEYZsaxbH4" },
  },
  livelihoodShopkeeper: {
    src: "/images/livelihood-shopkeeper.avif",
    alt: "A smiling woman behind the counter of her small provisions shop",
    width: 1200,
    height: 800,
    blurDataURL: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAQAgCdASoQAAsAA4BaJYgCdAYulhg9lkgAAP7CkfopkTUhezEw7BCOOuJwF7gSqkvMPRkWCevHqsGK18U5ppHsk09ubiRkPj1/V8jDFo1+u+f1JUE7g10HQgNBJslPdIAAAA==",
    position: "center 35%",
    credit: { name: "Ali Mkumbwa", url: "https://unsplash.com/photos/EOkN2pRjFsg" },
  },
  motherCradlingBaby: {
    src: "/images/mother-cradling-baby.avif",
    alt: "A mother sits on a bench, gently cradling her newborn baby",
    width: 1000,
    height: 1500,
    blurDataURL: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAACwBACdASoQABgAPu1kqU2ppaQiMAgBMB2JQBAADJsswAdWFeZossDNUGzknaCAAP7xzJZO4nh39jjsT+GFqgdef4759LbzjCVWYcO2HdfH92yXAOECyWu+KIE3ZIfEJfWmMzV30I8KeH7hC7lc0ZFzjxtmTvs5h4/x+Lh0cfMM5H0PjSSaPSSWS6vjrj8W834PV8VP8fecbXmDbkWqVh9l+TrcpL786F+yeZv5LkOjjwAA",
    position: "center 60%",
    credit: { name: "Richard Nyoni", url: "https://unsplash.com/photos/sgjI2jzC1wg" },
  },
  childrenLaughing: {
    src: "/images/children-laughing.avif",
    alt: "A group of children laughing together",
    width: 800,
    height: 635,
    blurDataURL: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABwAgCdASoQAA0AA4BaJYgCdAYqNqyKeiDFuS4AAP7a0vBdte6x+Gla9d9h0nGKni3C2UvnPjvVA34TxW74AvJziG7ketub6EIPJLVxdVuoDYCztjYDbYdm/6Swwxhdr5sLn9etTs6z4ECfBNWGOdllAEY6+oAA",
    position: "center 30%",
    credit: { name: "Annie Spratt", url: "https://unsplash.com/@anniespratt" },
  },
  newsMotherFarm: {
    src: "/images/news-mother-farm.avif",
    alt: "A mother walks through green farmland carrying her baby on her back",
    width: 1000,
    height: 666,
    blurDataURL: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQAAsAA4BaJQBOgMXc2ExQjlQA4DZSUU6dgyVhiDBbrktnjneohn4U95VjvSM0uWT4pWRoaktYR8wysuOd0oOxFgz4hapf6iYip9eoQhHl4AAA",
    position: "center",
    credit: { name: "Annie Spratt", url: "https://unsplash.com/photos/1YnBzhJISg4" },
  },
  newsChildrenCarer: {
    src: "/images/news-children-carer.avif",
    alt: "Children sit together outside a building as a woman looks on",
    width: 1000,
    height: 666,
    blurDataURL: "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAQCdASoQAAsAA4BaJbACdAC4BLigAAD+J1lP+GhNeAI5tch2Ar5a2kUwmdcgP5/iVZy9IUObf4r4fWFiJ/1mi54wusM1C8HrqI+LLvT3WI3u3TkMQtvzKrS8hT2GAAA=",
    position: "center",
    credit: { name: "Oswald Elsaboath", url: "https://unsplash.com/@oswaldelsaboath" },
  },
  newsElderMarket: {
    src: "/images/news-elder-market.avif",
    alt: "An elderly woman sorts dried peppers at an outdoor market",
    width: 1000,
    height: 750,
    blurDataURL: "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAACQAgCdASoQAAwAA4BaJbACdBHAH9svUFi1KLZAuAD+kbrpX/DxgO+E9CzwGKLmrttwMzzvgHlW2DXH0ETUcgZmmqXqj7jc4vjq/jMS6ZLl5tLeYFvvBjlm6Wydi1IVKwLPGyCoMJOlWL++hlCUMF0AAAA=",
    position: "center 40%",
    credit: { name: "Hendrik Morkel", url: "https://unsplash.com/photos/tE9Qsv_eV2o" },
  },
} satisfies Record<string, Photo>;
