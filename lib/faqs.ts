/**
 * Frequently asked questions. Every answer is drawn from information-bank.md
 * (CERT, CONST, STATUS). Plain strings so they can also feed FAQPage JSON-LD.
 */

import { org } from "./site";

export type FAQ = { question: string; answer: string };
export type FAQGroup = { id: string; title: string; items: FAQ[] };

export const faqGroups: FAQGroup[] = [
  {
    id: "about",
    title: "About The Foundation",
    items: [
      {
        question: "What is Ada Gradan Compassionate Care Hands Foundation?",
        answer:
          "We are a not-for-profit, non-political welfare organisation providing educational support, vocational training, small business setup, elderly stipends and medical assistance to orphans, single parents, widows, the elderly and the critically ill.",
      },
      {
        question: "Is the Foundation officially registered?",
        answer: `Yes. We are a registered non-profit in Nigeria (IT No. ${org.cacNumber}).`,
      },
      {
        question: "Where is the Foundation based?",
        answer: `Our office is at ${org.address.lines.join(", ")}.`,
      },
      {
        question: "Who runs the Foundation?",
        answer:
          "The Foundation is led by its trustees: our Chairman, Jacinta Ada Obijiaku, and our Secretary, Blessing Ngozichukwu Uzoeto. Trustees are elected at a General Meeting by a two-thirds majority of members present, and serve terms of up to five years.",
      },
    ],
  },
  {
    id: "giving",
    title: "Giving & Accountability",
    items: [
      {
        question: "How are donations used?",
        answer:
          "Our constitution requires all income and property to be applied solely to the Foundation's charitable objectives. Nothing is distributed to members as profit, and governing-body members receive no salary beyond out-of-pocket expenses, reasonable rent or reasonable fees for services.",
      },
      {
        question: "Can I donate online by card?",
        answer:
          "Not yet. Online payments are not set up, and no payment is taken on this website. Our Donate page shows how to complete a gift by bank transfer or by contacting us.",
      },
      {
        question: "How is the Foundation held accountable?",
        answer:
          "We keep a bank account in the Foundation's own name and maintain an income register, a cash receipts and payment register, and a bank lodgement and payment register. Independent, licensed auditors review our accounts each year; their report goes to our Annual General Meeting.",
      },
      {
        question: "How is the Foundation funded?",
        answer:
          "Our constitution provides for freewill donations and contributions from members; grants and aid from individuals, corporate bodies or government agencies; fundraising events and community projects; and membership levies and other lawful means.",
      },
    ],
  },
  {
    id: "programmes",
    title: "Programmes",
    items: [
      {
        question: "What programmes do you run?",
        answer:
          "Six programmes, each from an aim in our constitution: skills and vocational training, medical aid and care, elderly care and stipends, support for orphans, widows and vulnerable families, children's education support, and livelihood and small business empowerment.",
      },
      {
        question: "Who does the Foundation support?",
        answer:
          "Orphans and abandoned children, underprivileged and destitute children, widows and widowers, single mothers and single fathers, less privileged men and women, the elderly, people living with critical or chronic illness, and destitute individuals.",
      },
      {
        question: "Can I choose which programme my gift supports?",
        answer:
          "When you give, you can tell us which programme you would like to support, or leave your gift to be used where it is needed most.",
      },
    ],
  },
  {
    id: "contact",
    title: "Getting In Touch",
    items: [
      {
        question: "How can I contact the Foundation?",
        answer:
          "Use the form on our Contact page. Our official email address and phone number are being confirmed and will be published there.",
      },
      {
        question: "Can my organisation partner with you?",
        answer:
          "Our constitution welcomes grants and aid from individuals, corporate bodies and government agencies. Please get in touch through our Contact page and choose “Grants and partnerships”.",
      },
    ],
  },
];
