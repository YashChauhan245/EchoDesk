"use client";
import { SCENARIOS } from "./data";
import { createDemoReply, getDemoReply } from "./utils";

import {
  ArrowUpRight,
  AudioLines,
  ChevronRight,
  Globe,
  Send,
  X,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

export default function EmbedPreview() {
  const [open, setOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState(() => ({
    ...createDemoReply(SCENARIOS[0]),
    answer:
      "Absolutely. Start with 1 chatbot, 1 website, and 500 AI messages per month on the Free plan. Upgrade whenever you need more room.",
  }));
  const bubble = useRef<HTMLButtonElement>(null);

  function closeWidget() {
    setOpen(false);
    bubble.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setReply(getDemoReply(question));
    setQuestion("");
  }
  return (
    <div className="embed-browser mt-8 mb-0 max-w-200 rounded-[6px] bg-[#0d0f12] overflow-hidden mx-auto border border-[#22252b]">
      <div className="embed-browser-bar flex items-center justify-between border-b border-b-[#22252b] gap-[15px] max-[720px]:px-3 max-[720px]:py-2 min-[720px]:px-3.5 min-[720px]:py-[9px] [&>span]:flex [&>span]:items-center [&>span]:[line-height:normal] [&>span]:font-mono [&>span]:font-normal [&>span]:not-italic [&>span]:text-[#9297a3] [&>span]:gap-[7px] max-[390px]:[&>span]:text-[9px] min-[390px]:[&>span]:text-[10px] [&>button]:flex [&>button]:items-center [&>button]:text-[#bbc2ce] [&>button]:min-h-6.5 max-[390px]:[&>button]:text-[10px] max-[390px]:[&>button]:gap-1 min-[390px]:max-[720px]:[&>button]:gap-[5px] min-[720px]:[&>button]:gap-[7px] min-[390px]:[&>button]:text-[11px] [&>button:hover]:text-white">
        <span>
          <Globe size={11} /> yourwebsite.com
        </span>
        <button
          aria-expanded={open}
          aria-controls="embed-widget"
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Hide widget" : "Preview the embed"}</span>{" "}
          <ArrowUpRight size={12} />
        </button>
      </div>
      <div className="embed-browser-body max-[720px]:min-h-152.5 max-[720px]:px-5 max-[720px]:py-[23px] min-[720px]:min-h-140 min-[720px]:px-7.5 min-[720px]:py-10.5 relative bg-[#0d0f12] [&>div:first-child]:flex [&>div:first-child]:flex-col [&>div:first-child]:max-w-87.5 [&>div:first-child]:gap-2 max-[720px]:[&>.embed-site-sample]:max-w-full min-[720px]:[&>.embed-site-sample]:max-w-[43%] [&>.embed-site-sample]:gap-0">
        <div className="embed-site-sample max-[720px]:[&_h3]:mt-3 max-[720px]:[&_h3]:max-w-62.5 min-[720px]:[&_h3]:mt-[17px] [&_h3]:text-[32px] [&_h3]:leading-[1.15] [&_h3]:tracking-[-.04em] [&_h3]:font-medium [&_h3]:text-[#d5d7dc] [&>p]:mt-[15px] [&>p]:text-[13px] [&>p]:leading-[1.85] [&>p]:text-[#9297a3] max-[720px]:[&>p]:max-w-62.5">
          <span className="embed-site-brand flex items-center [font-weight:550] tracking-[-.04em] max-[720px]:text-[15px] max-[720px]:gap-[7px] min-[720px]:text-[16px] min-[720px]:gap-[9px] [&>span]:grid [&>span]:items-center [&>span]:justify-items-center [&>span]:rounded-[5px] [&>span]:border [&>span]:border-[#ffffff24] [&>span]:border-solid max-[720px]:[&>span]:w-[23px] max-[720px]:[&>span]:h-[23px] max-[720px]:[&>span]:text-[16px] min-[720px]:[&>span]:w-6.5 min-[720px]:[&>span]:h-6.5 min-[720px]:[&>span]:text-[18px]">
            <span aria-hidden="true">a.</span> Acme
          </span>
          <span className="embed-site-eyebrow max-[720px]:mt-[37px] min-[720px]:mt-[65px] text-[9px] [line-height:normal] font-mono font-normal tracking-[.08em] text-[#9297a3]">
            YOUR WEBSITE. YOUR BRAND.
          </span>
          <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
            A little help.
            <br />
            Right where it’s needed.
          </h3>
          <p>
            Your customers keep browsing.
            <br />
            EchoDesk takes care of the questions.
          </p>
          <span className="embed-site-note flex items-center text-[9px] [line-height:normal] font-mono font-normal text-[#9297a3] gap-1.5 max-[720px]:mt-6 min-[720px]:mt-10.5 [&>span]:h-1 [&>span]:w-1 [&>span]:bg-[#95aa9e] [&>span]:rounded-full">
            <span /> Sample website
          </span>
        </div>
        <section
          className="embed-preview-greeting absolute rounded-[7px] bg-[#111318] [box-shadow:0_12px_36px_#0005] flex flex-col overflow-hidden p-0 border border-[#ffffff21] max-[720px]:right-3 max-[720px]:bottom-[75px] max-[720px]:w-auto max-[720px]:top-16.5 max-[720px]:left-3 min-[720px]:right-5.5 min-[720px]:bottom-18.5 min-[720px]:w-85 min-[720px]:top-6.5 print:[box-shadow:none]! [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#e1e7f1] [&_p]:text-[10px] [&_p]:leading-[1.7] [&_p]:text-[#9da9bd] [&_p]:mt-[5px] [&>button]:absolute [&>button]:top-2 [&>button]:right-1.5 [&>button]:text-[#9297a3] [&_.embed-chat-welcome]:leading-[1.75] [&_.embed-chat-welcome]:text-[#cdd2dc] [&_.embed-chat-welcome]:m-0 max-[720px]:[&_.embed-chat-welcome]:text-[13px] min-[720px]:[&_.embed-chat-welcome]:text-[12px] [&_.embed-chat-answer]:leading-[1.75] [&_.embed-chat-answer]:text-[#cdd2dc] [&_.embed-chat-answer]:m-0 max-[720px]:[&_.embed-chat-answer]:text-[13px] min-[720px]:[&_.embed-chat-answer]:text-[12px] [&_.embed-chat-question]:mr-0 [&_.embed-chat-question]:ml-5 [&_.embed-chat-question]:self-end [&_.embed-chat-question]:bg-[#252c38] [&_.embed-chat-question]:rounded-[7px_7px_2px_7px] [&_.embed-chat-question]:leading-[1.75] [&_.embed-chat-question]:text-[#e2e8f2] [&_.embed-chat-question]:px-2.5 [&_.embed-chat-question]:py-2 [&_.embed-chat-question]:my-0 [&_.embed-chat-question]:border [&_.embed-chat-question]:border-[#ffffff0b] [&_.embed-chat-question]:border-solid max-[720px]:[&_.embed-chat-question]:text-[13px] min-[720px]:[&_.embed-chat-question]:text-[12px]"

          id="embed-widget"
          aria-label="Sample EchoDesk support widget"
          hidden={!open}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeWidget();
          }}
        >
          <header className="embed-chat-header flex items-center border-b border-b-[#22252b] bg-[#16191f] gap-2.5 max-[720px]:px-3.5 max-[720px]:py-[13px] min-[720px]:px-4 min-[720px]:py-[15px] [&>div]:flex [&>div]:flex-col [&>div]:gap-0.5 [&_strong]:text-[14px] [&_strong]:[font-weight:550] [&_strong]:text-[#e8eaf0] [&>div>span]:flex [&>div>span]:items-center [&>div>span]:text-[10px] [&>div>span]:text-[#a0aaa6] [&>div>span]:gap-1 [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-full [&_i]:bg-[#9bb5a6] [&>button]:grid [&>button]:items-center [&>button]:justify-items-center [&>button]:ml-auto [&>button]:text-[#9297a3] [&>button]:min-w-7 [&>button]:min-h-7 [&>button:hover]:text-white">
            <span className="embed-agent-icon grid items-center justify-items-center w-[31px] h-[31px] rounded-[6px] text-[#c7d0dd] border border-[#ffffff1c]">
              <AudioLines size={18} />
            </span>
            <div>
              <strong>Acme support</strong>
              <span>
                <i /> Powered by your knowledge
              </span>
            </div>
            <button
              aria-label="Close sample support widget"
              onClick={closeWidget}
            >
              <X size={16} />
            </button>
          </header>
          <div className="embed-chat-messages flex flex-col min-h-0 overflow-x-auto overflow-y-auto flex-1 [overscroll-behavior:contain] p-4.5 gap-[13px]">
            <span className="embed-chat-caption text-[9px] [line-height:normal] font-mono font-normal tracking-[.09em] text-[#9297a3] text-center mb-0.5">
              A SAMPLE CONVERSATION
            </span>
            <p className="embed-chat-welcome">Hi there. How can we help?</p>
            <p className="embed-chat-question">{reply.question}</p>
            <p className="embed-chat-answer" aria-live="polite">
              {reply.answer}
            </p>
            <span className="embed-chat-source max-[720px]:text-[9px] min-[720px]:text-[10px] text-[#8f9bab] mt-[-5px]">
              {reply.known
                ? `From your knowledge · ${reply.scenario.label}`
                : "Local demonstration · No live AI connection"}
            </span>
          </div>
          <div
            className="embed-chat-suggestions flex pt-0 pb-3 flex-wrap px-3.5 gap-1.5 [&>button]:flex [&>button]:items-center [&>button]:rounded-[4px] [&>button]:text-[11px] [&>button]:leading-[1.5] [&>button]:text-[#b8c0cd] [&>button]:[transition:background-color_.18s] [&>button]:px-[7px] [&>button]:py-[5px] [&>button]:border [&>button]:border-[#ffffff1c] [&>button]:border-solid [&>button]:gap-1 [&>button:hover]:bg-[#ffffff09] [&>button:hover]:text-[#eff1f5]"
            aria-label="Sample questions"
          >
            <button onClick={() => setReply(createDemoReply(SCENARIOS[1]))}>
              How do I install it? <ChevronRight size={11} />
            </button>
            <button onClick={() => setReply(createDemoReply(SCENARIOS[2]))}>
              What can it learn? <ChevronRight size={11} />
            </button>
          </div>
          <form
            className="embed-chat-form flex items-center rounded-[5px] bg-[#0e1116] mx-[13px] my-0 border border-[#ffffff1d] gap-[5px] [&>input]:w-full [&>input]:bg-transparent [&>input]:text-[#e4e7ef] [&>input]:rounded-[4px] [&>input]:p-2.5 [&>input]:border-0 [&>input]:border-[currentColor] [&>input]:border-none max-[720px]:[&>input]:text-[16px] max-[720px]:[&>input]:min-h-11 min-[720px]:[&>input]:text-[13px] min-[720px]:[&>input]:min-h-10.5 [&>input::placeholder]:text-[#7e8796] [&>button]:grid [&>button]:items-center [&>button]:justify-items-center [&>button]:min-w-[29px] [&>button]:min-h-[29px] [&>button]:mr-1 [&>button]:bg-[#bfcad9] [&>button]:text-[#141a22] [&>button]:rounded-[3px] [&>button:hover]:bg-[#e0e6ef] focus-within:border-[#91a6c8]"
            onSubmit={handleSubmit}
          >
            <label
              className="sr-only absolute w-px h-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap p-0 m-[-1px] border-0 border-none"
              htmlFor="embed-question"
            >
              Ask a sample support question
            </label>
            <input
              id="embed-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question…"
              autoComplete="off"
              maxLength={300}
            />
            <button type="submit" aria-label="Send sample question">
              <Send size={14} />
            </button>
          </form>
          <span className="embed-chat-footer flex justify-between leading-[1.6] text-[#959ead] px-3.5 py-2 max-[720px]:text-[9px] min-[720px]:text-[10px] [&>span]:text-[#778190]">
            EchoDesk <span>Local interactive demo</span>
          </span>
        </section>
        <button
          className="embed-preview-bubble absolute w-10 h-10 bg-[#d8deea] text-[#151922] rounded-[11px] flex items-center justify-center [transition:background-color_.18s] max-[720px]:bottom-[17px] max-[720px]:right-3 min-[720px]:bottom-4.5 min-[720px]:right-5.5 hover:bg-[#f1f3f8]"

          aria-label={
            open ? "Close sample support widget" : "Open sample support widget"
          }
          aria-expanded={open}
          aria-controls="embed-widget"
          ref={bubble}
          onClick={() => setOpen(!open)}
        >
          <AudioLines size={22} />
        </button>
      </div>
    </div>
  );
}
