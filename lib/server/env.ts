import "server-only";

/** Server-only environment access with clear errors. */
export function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return v;
}

export const optionalEnv = (name: string) => process.env[name] || undefined;

/**
 * Card payments (Flutterwave) are OFF unless CARD_PAYMENTS=on and the keys are
 * set. Bank transfer always works. Turn this on once Flutterwave is stable.
 */
export const cardPaymentsEnabled = () =>
  process.env.CARD_PAYMENTS === "on" && Boolean(process.env.FLW_SECRET_KEY);
