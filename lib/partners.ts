/**
 * Partners & supporters. The Foundation has no partners yet
 * (information-bank.md §7), so the band is switched off.
 *
 * To turn it on: add verified partners below (with their permission to be
 * listed) and set `showPartners` to true. The band also stays hidden while the
 * list is empty, so flipping the switch alone can never show empty slots.
 */

export type Partner = {
  name: string;
  /** Logo in /public (SVG preferred). Without one, the name is shown. */
  logo?: string;
  url?: string;
};

export const showPartners = false;

export const partners: Partner[] = [];

export const partnersVisible = () => showPartners && partners.length > 0;
