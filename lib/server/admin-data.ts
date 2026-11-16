import "server-only";
import type { Filter } from "mongodb";
import { donations, type Donation } from "./db";

export type View = "unacknowledged" | "all";
export const PAGE_SIZE = 25;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listDonations({ view, q, page }: { view: View; q: string; page: number }) {
  const filter: Filter<Donation> = {};
  if (view === "unacknowledged") filter.acknowledgement = { $exists: false };
  const term = q.trim().slice(0, 100);
  if (term) {
    const rx = new RegExp(escapeRegex(term), "i");
    filter.$or = [{ reference: rx }, { "donor.email": rx }, { "donor.name": rx }];
  }
  const col = await donations();
  const [rows, total] = await Promise.all([
    col
      .find(filter)
      .sort({ createdAt: view === "unacknowledged" ? 1 : -1 }) // oldest waiting first
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    col.countDocuments(filter),
  ]);
  return { rows, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function donationStats() {
  const col = await donations();
  const [unacknowledged, all, received] = await Promise.all([
    col.countDocuments({ acknowledgement: { $exists: false } }),
    col.estimatedDocumentCount(),
    col
      .aggregate<{ _id: string; total: number; count: number }>([
        { $match: { acknowledgement: { $exists: true } } },
        { $group: { _id: "$currency", total: { $sum: "$acknowledgement.receivedMinor" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
  ]);
  return { unacknowledged, all, received };
}

export async function getDonation(reference: string) {
  if (!/^(TRF|AGF)-[A-Z0-9-]{4,40}$/.test(reference)) return null;
  return (await donations()).findOne({ reference });
}
