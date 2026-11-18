import { ArrowUpRight, Flag, MessageSquare } from "lucide-react";
import InboxPreview from "./InboxPreview";
import { SectionLabel } from "./LandingUI";

export default function InboxSection() {
  return (
    <section
      className="section ed-container inbox-section max-w-320 w-full m-auto max-[720px]:py-21 min-[720px]:px-8 min-[720px]:py-[clamp(96px,10vw,144px)] max-[390px]:px-5 min-[390px]:max-[720px]:px-6 print:p-0! print:[&>.section-label]:hidden! print:[&>.editorial-heading]:hidden!"
      id="inbox"
    >
      <SectionLabel number="03">
        AUTOMATED ANSWERS. HUMAN OVERSIGHT.
      </SectionLabel>
      <div className="editorial-heading max-[720px]:block max-[720px]:mb-[29px] min-[720px]:grid min-[720px]:mb-[45px] [grid-template-columns:1.25fr_1fr] items-end max-[900px]:gap-[45px] min-[900px]:gap-20 max-[720px]:[&>p]:text-[14px] max-[720px]:[&>p]:mt-5 min-[720px]:[&>p]:text-[15px] [&>p]:leading-[1.85] [&>p]:text-[#9297a3] [&>p]:pb-0.5 [&>p]:max-w-100 [&>p]:justify-self-end max-[720px]:[&>p_br]:hidden">
        <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
          Keep the conversation.
          <br />
          And the connection.
        </h2>
        <p>
          Read what your customers are asking.
          <br />
          Review replies that need a closer look.
          <br />
          Let the inbox bring the full story together.
        </p>
      </div>
      <InboxPreview />
      <div className="inbox-notes flex justify-between text-[#9297a3] max-[720px]:mt-5.5 max-[720px]:text-[12px] max-[720px]:flex-col max-[720px]:gap-3.5 min-[720px]:mt-[25px] min-[720px]:text-[13px] min-[720px]:gap-5 print:hidden! [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&_svg]:text-[#7d899d]">
        <span>
          <MessageSquare size={14} /> Full conversation threads
        </span>
        <span>
          <Flag size={14} /> Flagged, low-confidence replies
        </span>
        <span>
          <ArrowUpRight size={14} /> CSV, JSON, and PDF exports
        </span>
      </div>
    </section>
  );
}
