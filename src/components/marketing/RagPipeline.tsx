import {
  BrainCircuit,
  FileUp,
  MessageSquareText,
  ScanSearch,
  Scissors,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Shared";
const nodes = [
  { icon: FileUp, title: "Add", detail: "Your PDFs, pages, and FAQs." },
  {
    icon: Scissors,
    title: "Organize",
    detail: "Small passages, easy to find.",
  },
  {
    icon: BrainCircuit,
    title: "Understand",
    detail: "Connect meaning, not just words.",
  },
  {
    icon: ScanSearch,
    title: "Find",
    detail: "Pick the most relevant excerpts.",
  },
  {
    icon: MessageSquareText,
    title: "Answer",
    detail: "A helpful reply from your content.",
  },
];
export default function RagPipeline() {
  return (
    <section className="mk-section mk-pipeline-section">
      <div className="mk-container">
        <Reveal>
          <SectionHeading
            centered
            eyebrow="YOUR EXPERTISE. NEVER A GUESS."
            title={
              <>
                Good answers start
                <br />
                with <span className="mk-gradient">your content.</span>
              </>
            }
          >
            Your bot searches your knowledge before it speaks. So a question
            about your business gets an answer from your business.
          </SectionHeading>
        </Reveal>
        <Reveal>
          <div
            className="mk-pipeline"
            aria-label="How your content becomes an answer"
          >
            {nodes.map(({ icon: Icon, title, detail }, index) => (
              <div
                className="mk-pipeline-node"
                key={title}
                style={
                  { "--node-delay": `${index * 0.35}s` } as React.CSSProperties
                }
              >
                <span className="mk-node-index">0{index + 1}</span>
                <div className="mk-node-icon">
                  <Icon size={23} strokeWidth={1.4} />
                  <span />
                </div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <div className="mk-pipeline-foot">
            <span>
              <span className="mk-live-dot" />
              Your content in. Grounded answers out.
            </span>
            <small>Powered by retrieval-augmented generation (RAG)</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
