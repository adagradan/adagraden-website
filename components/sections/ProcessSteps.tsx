import type { CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";

export type Step = { title: string; text: string };

/** Numbered process: large number, rule, title, short text (rules.md §5.5). */
export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => {
        const n = String(i + 1).padStart(2, "0");
        const stagger = { "--i": i, "--d": `${i * 120}ms` } as CSSProperties;
        return (
          <li key={step.title} className="flex flex-col">
            <span aria-hidden="true" className="text-display font-normal" data-reveal="split" style={stagger}>
              <SplitText text={n} by="chars" />
            </span>
            <span aria-hidden="true" className="mt-5 block h-px bg-line" data-reveal="line" style={stagger} />
            <div className="pt-5" data-reveal="up" style={{ "--i": i + 2 } as CSSProperties}>
              <h3 className="text-card font-medium">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-meta leading-relaxed text-muted">{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
