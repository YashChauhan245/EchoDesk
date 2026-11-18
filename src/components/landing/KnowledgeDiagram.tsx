import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  FileText,
  Globe,
  MessageSquare,
} from "lucide-react";

const sources = [
  { Icon: FileText, title: "Product guide.pdf", detail: "PDF document" },
  { Icon: Globe, title: "yourwebsite.com/help", detail: "Website content" },
  {
    Icon: BookOpen,
    title: "Frequently asked questions",
    detail: "Your team’s answers",
  },
];

export default function KnowledgeDiagram() {
  return (
    <figure
      className="knowledge-visual knowledge-flow relative min-h-0 rounded-[6px] bg-[#0d0f12] overflow-hidden flex flex-col border border-[#22252b] max-[720px]:w-full max-[720px]:px-4 max-[720px]:py-5 min-[720px]:max-[721px]:p-6 min-[721px]:max-[1100px]:p-5 min-[1100px]:p-6 min-[721px]:max-[900px]:max-w-full"
      aria-label="Your PDFs, website content, and FAQs are processed into relevant context for an AI answer"
    >
      <div className="knowledge-flow-heading flex items-center justify-between [line-height:normal] font-mono font-normal tracking-[.04em] text-[#9297a3] max-[720px]:text-[8px] max-[720px]:gap-2 min-[720px]:text-[9px] min-[720px]:gap-4 max-[390px]:[&>span:last-child]:hidden min-[390px]:[&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:tracking-[0] [&>span:last-child]:[line-height:normal] [&>span:last-child]:font-sans [&>span:last-child]:font-normal [&>span:last-child]:not-italic [&>span:last-child]:gap-1.5 max-[720px]:[&>span:last-child]:text-[9px] min-[720px]:[&>span:last-child]:text-[10px] [&_i]:h-1 [&_i]:w-1 [&_i]:bg-[#91b7a2] [&_i]:rounded-full">
        <span>YOUR KNOWLEDGE, CONNECTED</span>
        <span>
          <i /> Ready to help
        </span>
      </div>
      <div className="knowledge-flow-top grid items-center max-[390px]:[grid-template-columns:minmax(0,1fr)_16px_68px] min-[390px]:max-[720px]:[grid-template-columns:minmax(0,1fr)_22px_76px] min-[720px]:max-[721px]:[grid-template-columns:minmax(0,1fr)_40px_100px] min-[721px]:max-[900px]:[grid-template-columns:minmax(0,1fr)_70px_120px] min-[900px]:max-[1100px]:[grid-template-columns:minmax(0,1fr)_22px_78px] min-[1100px]:[grid-template-columns:minmax(0,1fr)_40px_100px] max-[720px]:mt-7 min-[720px]:mt-9">
        <div className="knowledge-inputs flex flex-col min-w-0 gap-2.5">
          {sources.map(({ Icon, title, detail }) => (
            <div
              className="knowledge-input flex items-center bg-[#111318] rounded-[4px] min-w-0 border border-[#22252b] max-[720px]:px-[9px] max-[720px]:py-3 max-[720px]:gap-2 min-[720px]:max-[721px]:px-3 min-[720px]:max-[721px]:py-[13px] min-[720px]:max-[721px]:gap-[11px] min-[721px]:max-[1100px]:px-2 min-[721px]:max-[1100px]:py-[11px] min-[721px]:max-[1100px]:gap-[7px] min-[1100px]:px-3 min-[1100px]:py-[13px] min-[1100px]:gap-[11px] [&>svg:first-child]:text-[#91a6c8] max-[720px]:[&>svg:first-child]:w-[15px] [&>svg:last-child]:text-[#91b7a2] [&>svg:last-child]:ml-auto max-[720px]:[&>svg:last-child]:hidden [&>span]:min-w-0 [&>span]:whitespace-nowrap [&>span]:overflow-x-hidden [&>span]:overflow-y-hidden [&>span]:text-ellipsis [&>span]:text-[#cbd0da] max-[390px]:[&>span]:text-[10px] min-[390px]:max-[720px]:[&>span]:text-[11px] min-[720px]:max-[721px]:[&>span]:text-[12px] min-[721px]:max-[1100px]:[&>span]:text-[11px] min-[1100px]:[&>span]:text-[12px] [&_small]:block [&_small]:text-[10px] [&_small]:text-[#9297a3] [&_small]:mt-[3px]"
              key={title}
            >
              <Icon size={18} />
              <span>
                {title}
                <small>{detail}</small>
              </span>
              <Check size={12} />
            </div>
          ))}
        </div>
        <div
          className="knowledge-flow-arrow flex items-center text-[#91a6c8] ml-[7px] [&>span]:h-px [&>span]:bg-[#91a6c850] [&>span]:flex-1"
          aria-hidden="true"
        >
          <span />
          <ArrowRight size={14} />
        </div>
        <div className="knowledge-process flex flex-col items-center text-center [&>span]:grid [&>span]:items-center [&>span]:justify-items-center [&>span]:bg-[#16191f] [&>span]:text-[#91a6c8] [&>span]:border [&>span]:border-[#91a6c850] [&>span]:border-solid max-[720px]:[&>span]:w-12.5 max-[720px]:[&>span]:h-12.5 max-[720px]:[&>span]:rounded-[6px] min-[720px]:max-[721px]:[&>span]:w-15 min-[720px]:max-[721px]:[&>span]:h-15 min-[721px]:max-[900px]:[&>span]:w-16 min-[721px]:max-[900px]:[&>span]:h-16 min-[900px]:max-[1100px]:[&>span]:w-13 min-[900px]:max-[1100px]:[&>span]:h-13 min-[1100px]:[&>span]:w-15 min-[1100px]:[&>span]:h-15 min-[720px]:[&>span]:rounded-[8px] max-[720px]:[&_strong]:text-[11px] min-[720px]:[&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:mt-3 [&_small]:text-[10px] [&_small]:leading-[1.6] [&_small]:mt-[5px] [&_small]:text-[#9297a3]">
          <span>
            <AudioLines size={28} />
          </span>
          <strong>EchoDesk</strong>
          <small>
            Knowledge
            <br />
            processing
          </small>
        </div>
      </div>
      <div className="knowledge-bridge self-end flex flex-col items-center text-[#91a6c8] mx-0 my-3 gap-2 max-[390px]:w-17 min-[390px]:max-[720px]:w-19 min-[720px]:max-[721px]:w-25 min-[721px]:max-[900px]:w-30 min-[900px]:max-[1100px]:w-19.5 min-[1100px]:w-25 max-[720px]:[&>span]:text-[8px] min-[720px]:[&>span]:text-[9px]">
        <span>Relevant context</span>
        <ArrowDown size={14} aria-hidden="true" />
      </div>
      <div className="knowledge-answer flex items-start bg-[#111318] rounded-[5px] mt-0 border border-[#30343d] max-[720px]:px-3 max-[720px]:py-4 max-[720px]:gap-2.5 min-[720px]:px-[17px] min-[720px]:py-5 min-[720px]:gap-3 [&>div]:min-w-0 [&>div]:flex-1 max-[720px]:[&_strong]:text-[13px] min-[720px]:[&_strong]:text-[14px] [&_strong]:font-medium [&_strong]:text-[#f1f2f4] [&_p]:text-[12px] [&_p]:leading-[1.75] [&_p]:text-[#9297a3] [&_p]:mt-1.5 [&>div>span]:flex [&>div>span]:items-center [&>div>span]:text-[10px] [&>div>span]:text-[#91a6c8] [&>div>span]:mt-3 [&>div>span]:gap-[5px] [&>svg]:text-[#91b7a2] [&>svg]:mt-1.5 max-[720px]:[&>svg]:hidden">
        <span className="knowledge-answer-icon max-[390px]:hidden min-[390px]:grid items-center justify-items-center w-7.5 h-7.5 rounded-[5px] text-[#91a6c8] shrink-0 border border-[#22252b]">
          <MessageSquare size={18} />
        </span>
        <div>
          <strong>An answer that knows the details.</strong>
          <p>
            Useful context from your content, brought into the conversation.
          </p>
          <span>
            <FileText size={12} /> Grounded in your knowledge
          </span>
        </div>
        <Check size={14} />
      </div>
      <figcaption className="knowledge-flow-note flex items-center justify-center mt-auto pt-5.5 leading-[1.5] text-[#9297a3] text-center max-[720px]:text-[8px] max-[720px]:flex-wrap max-[720px]:gap-[5px] min-[720px]:text-[9px] min-[720px]:gap-2">
        Your sources <ArrowRight size={11} /> Relevant context{" "}
        <ArrowRight size={11} /> A helpful answer
      </figcaption>
    </figure>
  );
}
