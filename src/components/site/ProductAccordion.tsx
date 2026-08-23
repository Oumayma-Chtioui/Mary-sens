"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function ProductAccordion({
  sections,
}: {
  sections: Array<{ title: string; content: string }>;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2 border-t border-white/15 pt-2">
      {sections.map((section, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={section.title} className="border-b border-white/15">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-white"
            >
              {section.title}
              {isOpen ? <Minus className="size-5 text-or" /> : <Plus className="size-5 text-or" />}
            </button>
            {isOpen && (
              <p className="whitespace-pre-line pb-4 text-sm leading-relaxed text-white/60">
                {section.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
