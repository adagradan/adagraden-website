"use server";

import { subjects } from "@/lib/contact";

/**
 * Contact form Server Action.
 *
 * Delivery: no official inbox or mail provider is confirmed yet
 * (information-bank.md open items #2, #3). Set CONTACT_WEBHOOK_URL to any
 * endpoint that accepts a JSON POST (Formspree, Make, Zapier, Google Apps
 * Script, your own API…) and messages are forwarded there. Until then the
 * form validates but tells the visitor honestly that nothing was sent.
 */

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;

export type ContactState =
  | { status: "idle"; values: ContactValues }
  | { status: "invalid"; values: ContactValues; errors: Partial<Record<ContactField, string>> }
  | { status: "sent"; values: ContactValues }
  | { status: "not-configured"; values: ContactValues }
  | { status: "failed"; values: ContactValues };


const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values: ContactValues = {
    name: get("name"),
    email: get("email"),
    subject: get("subject"),
    message: get("message"),
  };

  // Honeypot: real people never see or fill this field.
  if (get("company")) return { status: "sent", values: { name: "", email: "", subject: "", message: "" } };

  const errors: Partial<Record<ContactField, string>> = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Please enter a valid email address, like name@example.com.";
  if (!subjects.includes(values.subject as (typeof subjects)[number])) errors.subject = "Please choose a subject.";
  if (values.message.length < 10) errors.message = "Please write a message of at least 10 characters.";
  else if (values.message.length > 4000) errors.message = "Please keep your message under 4,000 characters.";
  if (Object.keys(errors).length) return { status: "invalid", values, errors };

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) return { status: "not-configured", values };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...values, source: "website-contact-form", receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: "failed", values };
    return { status: "sent", values: { name: "", email: "", subject: "", message: "" } };
  } catch {
    return { status: "failed", values };
  }
}
