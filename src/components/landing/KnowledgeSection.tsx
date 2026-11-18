import { ArrowUpRight } from "lucide-react";
import KnowledgeDiagram from "./KnowledgeDiagram";
import { SectionLabel } from "./LandingUI";

export default function KnowledgeSection() {
  return (
    <section
      className="section ed-container knowledge-section max-w-320 w-full m-auto max-[720px]:py-21 min-[720px]:px-8 min-[720px]:py-[clamp(96px,10vw,144px)] max-[390px]:px-5 min-[390px]:max-[720px]:px-6 print:hidden!"
      id="knowledge"
    >
      <SectionLabel number="01">A FOUNDATION THAT’S YOURS</SectionLabel>
      <div className="editorial-heading max-[720px]:block max-[720px]:mb-[29px] min-[720px]:grid min-[720px]:mb-[45px] [grid-template-columns:1.25fr_1fr] items-end max-[900px]:gap-[45px] min-[900px]:gap-20 max-[720px]:[&>p]:text-[14px] max-[720px]:[&>p]:mt-5 min-[720px]:[&>p]:text-[15px] [&>p]:leading-[1.85] [&>p]:text-[#9297a3] [&>p]:pb-0.5 [&>p]:max-w-100 [&>p]:justify-self-end max-[720px]:[&>p_br]:hidden">
        <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
          Every good answer
          <br />
          starts with your knowledge.
        </h2>
        <p>
          Your product details, policies, and help articles.
          <br />
          All the information your team already trusts,
          <br />
          put to work in every conversation.
        </p>
      </div>
      <div className="knowledge-composition max-[720px]:flex max-[720px]:flex-col max-[720px]:gap-8 min-[720px]:grid [@media(width<721px)]:[grid-template-columns:1.3fr_1fr] min-[721px]:max-[900px]:[grid-template-columns:1fr] min-[721px]:max-[900px]:gap-8 min-[900px]:max-[1100px]:[grid-template-columns:1.2fr_1fr] min-[900px]:max-[1100px]:gap-9 min-[1100px]:[grid-template-columns:1.45fr_1fr] min-[1100px]:gap-17.5 min-[720px]:max-[721px]:gap-[35px]">
        <KnowledgeDiagram />
        <div className="knowledge-notes max-[720px]:[&_article]:py-5.5 min-[720px]:max-[721px]:[&_article]:py-6.5 min-[721px]:max-[900px]:[&_article]:py-0 min-[721px]:max-[900px]:[&_article]:border-0 min-[721px]:max-[900px]:[&_article]:border-[currentColor] min-[721px]:max-[900px]:[&_article]:border-none min-[900px]:[&_article]:border-b min-[900px]:[&_article]:border-b-[#22252b] min-[900px]:[&_article]:py-6.5 [&_article]:px-0 [@media(width<721px)]:[&_article]:border-b [@media(width<721px)]:[&_article]:border-b-[#22252b] [&_article:first-child]:pt-0 [&_article:last-child]:border-b-[0] [&_article:last-child]:[border-bottom-style:none] [&_article:last-child]:border-b-[currentColor] [&_article:last-child]:pb-0 [&_h3]:text-[23px] [&_h3]:mt-[13px] [&_h3]:mb-[11px] [&_h3]:font-medium [&_h3]:mx-0 [&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#9297a3] max-[720px]:[&_p]:max-w-none max-[720px]:[&_p]:min-h-0 min-[720px]:[&_p]:max-w-87.5 [&_.text-link]:mt-5 max-[720px]:[&_.text-link]:text-[13px] min-[720px]:max-[900px]:[&_.text-link]:text-[11px] min-[900px]:[&_.text-link]:text-[12px] min-[721px]:max-[900px]:grid min-[721px]:max-[900px]:[grid-template-columns:1fr_1fr] min-[721px]:max-[900px]:gap-8">
          <article>
            <span className="detail-index text-[10px] [line-height:normal] font-mono font-normal text-[#777f8e]">
              01.1
            </span>
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              Bring what you already know.
            </h3>
            <p>
              Add PDFs, website pages, or plain text. Your knowledge stays at
              the center of the conversation.
            </p>
            <div className="format-list flex mt-4.5 gap-[7px] [&>span]:rounded-[4px] [&>span]:text-[#9297a3] [&>span]:bg-[#ffffff02] [&>span]:px-2 [&>span]:py-[3px] [&>span]:border [&>span]:border-[#22252b] [&>span]:border-solid max-[720px]:[&>span]:text-[11px] min-[720px]:[&>span]:text-[10px]">
              <span>PDF</span>
              <span>Website</span>
              <span>Text</span>
            </div>
          </article>
          <article>
            <span className="detail-index text-[10px] [line-height:normal] font-mono font-normal text-[#777f8e]">
              01.2
            </span>
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              Find the context that matters.
            </h3>
            <p>
              EchoDesk retrieves relevant excerpts from your content to guide
              each reply. Test important questions before you share your agent.
            </p>
            <a
              href="#product"
              className="text-link [&_svg]:[transition:transform_.2s] [&:hover_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:hover_svg]:[transform:none]! inline-flex items-center text-[14px] text-[#d5d7df] gap-2.5 [&:focus-visible_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:focus-visible_svg]:[transform:none]!"
            >
              See it in the playground <ArrowUpRight size={13} />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
