"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQS } from "./data";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section
      className="section ed-container faq-section max-w-320 w-full grid m-auto max-[720px]:pt-0 max-[720px]:pb-21 max-[720px]:[grid-template-columns:1fr] max-[720px]:gap-[31px] min-[720px]:pt-[25px] min-[720px]:pb-[clamp(96px,10vw,144px)] min-[720px]:[grid-template-columns:1fr_1.2fr] min-[720px]:px-8 max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:max-[900px]:gap-[45px] min-[900px]:max-[1100px]:gap-17.5 min-[1100px]:gap-25 print:hidden! max-[720px]:[&_h2]:mt-5 min-[720px]:[&_h2]:mt-6 max-[720px]:[&_.eyebrow]:text-[10px]"
      id="faq"
    >
      <div>
        <div className="eyebrow text-[12px] tracking-[.12em] font-medium text-[#9297a3]">
          A LITTLE MORE CONTEXT
        </div>
        <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
          Good questions.
          <br />
          Straight answers.
        </h2>
      </div>
      <div className="faq-list border-t border-t-[#22252b]">
        {FAQS.map(([question, answer], index) => (
          <div
            className={`faq-item border-b border-b-[#22252b] [&_h3]:font-sans [&_h3]:font-normal [&_h3]:tracking-[-.01em] [&_h3]:leading-[1.6] max-[720px]:[&_h3]:text-[14px] min-[720px]:[&_h3]:text-[15px] [&_button]:flex [&_button]:items-center [&_button]:justify-between [&_button]:w-full [&_button]:leading-[1.7] [&_button]:text-left [&_button]:text-[#c7cbd5] [&_button]:min-h-16 [&_button]:px-0 [&_button]:py-6 max-[720px]:[&_button]:gap-5 min-[720px]:[&_button]:gap-7.5 [&_button_svg]:text-[#9297a3] [&_button_svg]:[transition:transform_.25s] [&.open_button_svg]:[transform:rotate(45deg)] [&.open_button]:text-[#f1f2f4] [&.open_.faq-answer]:[grid-template-rows:1fr] [&.open_.faq-answer]:opacity-[1] ${index === openIndex ? "open" : ""}`}
            key={question}
          >
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              <button
                aria-expanded={index === openIndex}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {question}
                <Plus size={15} />
              </button>
            </h3>
            <div
              className="faq-answer grid [grid-template-rows:0fr] opacity-[0] [transition:grid-template-rows_.3s,opacity_.3s] [&>div]:overflow-x-hidden [&>div]:overflow-y-hidden [&>div]:min-h-0 [&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#9297a3] [&_p]:pt-0 [&_p]:pb-[23px] [&_p]:pl-0 max-[720px]:[&_p]:pr-[9px] min-[720px]:[&_p]:pr-5.5"
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              inert={index !== openIndex}
            >
              <div>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
