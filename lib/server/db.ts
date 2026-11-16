import "server-only";
import { MongoClient, type Collection } from "mongodb";
import { optionalEnv } from "./env";

/**
 * MongoDB (same approach as the sister ngo-website). MONGODB_URI is required
 * for the admin dashboard; without it, giving still works (emails only) and
 * the dashboard explains what is missing.
 */

export type DonationMethod = "bank-transfer" | "card";

export type Donation = {
  /** The public reference: TRF-XXXXXX (transfer) or AGF-… (card). */
  reference: string;
  method: DonationMethod;
  donor: { name: string; email: string; anonymous: boolean };
  /** Pledged (transfer) or paid (card) amount, in minor units (kobo/cents). */
  amountMinor: number;
  currency: string;
  cause: string;
  causeLabel: string;
  createdAt: Date;
  /** Transfer instructions email to the donor. */
  instructionsEmailedAt?: Date;
  /** Set when an admin confirms the money arrived (or automatically for card). */
  acknowledgement?: {
    at: Date;
    by: string;
    receivedMinor: number;
    note?: string;
    emailSentAt?: Date;
    emailError?: string;
  };
};

export type AdminToken = { tokenHash: string; email: string; expiresAt: Date; createdAt: Date };

export const dbConfigured = () => Boolean(optionalEnv("MONGODB_URI"));

const g = globalThis as unknown as { _mongo?: Promise<MongoClient>; _indexes?: Promise<void> };

async function database() {
  const uri = optionalEnv("MONGODB_URI");
  if (!uri) throw new Error("MONGODB_URI is not set.");
  g._mongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((e) => {
    g._mongo = undefined; // allow a retry on the next request
    throw e;
  });
  const db = (await g._mongo).db(optionalEnv("MONGODB_DB") ?? "adagradan");
  g._indexes ??= Promise.all([
    db.collection("donations").createIndex({ reference: 1 }, { unique: true }),
    db.collection("donations").createIndex({ createdAt: -1 }),
    db.collection("donations").createIndex({ "acknowledgement.at": 1, createdAt: -1 }),
    db.collection("donations").createIndex({ "donor.email": 1 }),
    db.collection("admin_tokens").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("admin_tokens").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).then(
    () => undefined,
    (e) => console.warn("[db] could not ensure indexes (continuing):", e instanceof Error ? e.message.slice(0, 120) : e),
  );
  await g._indexes;
  return db;
}

export const donations = async (): Promise<Collection<Donation>> => (await database()).collection<Donation>("donations");
export const adminTokens = async (): Promise<Collection<AdminToken>> => (await database()).collection<AdminToken>("admin_tokens");
