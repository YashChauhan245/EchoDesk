"use client";

import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Inbox,
  Layers,
  LockKeyhole,
  MessageSquare,
  RotateCcw,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SCENARIOS, type SupportScenario } from "./data";
import { createDemoReply, getDemoReply } from "./utils";

export default function ProductShowcase() {
  const [reply, setReply] = useState(() => createDemoReply(SCENARIOS[0]));
  const [question, setQuestion] = useState("");
  const [activePanel, setActivePanel] = useState<"chat" | "knowledge">("chat");
  const [contextOpen, setContextOpen] = useState(false);
  const chat = useRef<HTMLDivElement>(null);
  const citation = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (chat.current) chat.current.scrollTop = chat.current.scrollHeight;
  }, [reply]);

  function showScenario(scenario: SupportScenario) {
    setReply(createDemoReply(scenario));
    setActivePanel("chat");
    setContextOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setReply(getDemoReply(question));
    setQuestion("");
    setActivePanel("chat");
    setContextOpen(false);
  }

  function closeContext() {
    setContextOpen(false);
    citation.current?.focus();
  }
  return (
    <div
      className="product-stage relative scroll-mt-24 max-[720px]:mt-9.5 min-[720px]:mt-15 max-[390px]:mx-[-5px] min-[390px]:max-[720px]:mx-[-6px] [&::before]:[content:''] [&::before]:absolute [&::before]:left-[14%] [&::before]:right-[14%] [&::before]:top-[-1px] [&::before]:h-px [&::before]:bg-[#ffffff30] [&::before]:pointer-events-none"
      id="product"
      onKeyDown={(event) => {
        if (event.key === "Escape" && contextOpen) closeContext();
      }}
    >
      <div
        data-panel={activePanel}
        className={`product-frame relative rounded-[8px] bg-[#111318] overflow-x-hidden overflow-y-hidden [box-shadow:0_20px_64px_#0003] border border-[#30343d] [&.context-open_.context-pane]:border-[#899ab14d] max-[900px]:[&.context-open_.context-pane]:flex max-[900px]:[&.context-open_.context-pane]:absolute max-[900px]:[&.context-open_.context-pane]:right-0 max-[900px]:[&.context-open_.context-pane]:bottom-0 max-[900px]:[&.context-open_.context-pane]:z-[5] max-[900px]:[&.context-open_.context-pane]:[box-shadow:-18px_0_45px_#0005] max-[720px]:[&.context-open_.context-pane]:top-33 max-[720px]:[&.context-open_.context-pane]:w-70 max-[720px]:[&.context-open_.context-pane]:max-w-[95%] max-[720px]:[&.context-open_.context-pane]:pt-[19px] max-[720px]:[&.context-open_.context-pane]:pb-0 max-[720px]:[&.context-open_.context-pane]:px-[17px] min-[720px]:max-[900px]:[&.context-open_.context-pane]:top-22 min-[720px]:max-[900px]:[&.context-open_.context-pane]:w-[245px] max-[720px]:[&[data-panel='knowledge']_.source-pane]:flex max-[720px]:[&[data-panel='knowledge']_.conversation-pane]:hidden ${contextOpen ? "context-open" : ""}`}
      >
        <div className="app-chrome max-[720px]:h-7.5 max-[720px]:text-[10px] max-[720px]:px-2.5 max-[720px]:gap-2.5 min-[720px]:h-8.5 min-[720px]:text-[11px] min-[720px]:px-3.5 min-[720px]:gap-[17px] flex items-center bg-[#0d0f12] border-b border-b-[#22252b] text-[#9297a3] py-0 [&>span]:flex [&>span]:items-center [&>span]:gap-1.5 max-[390px]:[&>span]:text-[10px] [&_.demo-indicator]:ml-auto max-[720px]:[&_.demo-indicator]:text-[9px] max-[720px]:[&_.demo-indicator]:gap-[5px] min-[720px]:[&_.demo-indicator]:text-[10px] min-[720px]:[&_.demo-indicator]:gap-2">
          <div
            className="traffic flex max-[720px]:gap-[3px] min-[720px]:gap-[5px] max-[720px]:[&_i]:w-1 max-[720px]:[&_i]:h-1 min-[720px]:[&_i]:w-1.5 min-[720px]:[&_i]:h-1.5 [&_i]:rounded-full [&_i]:bg-[#42434b]"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </div>
          <span>
            EchoDesk <ChevronRight size={11} /> Your workspace
          </span>
          <span className="demo-indicator">
            Interactive demo{" "}
            <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />
          </span>
        </div>
        <div className="app-topbar max-[720px]:h-13 min-[720px]:h-13.5 min-[720px]:px-[17px] min-[720px]:gap-[25px] flex items-center bg-[#16191f] border-b border-b-[#22252b] py-0 max-[390px]:px-2.5 max-[390px]:gap-2.5 min-[390px]:max-[720px]:px-3 min-[390px]:max-[720px]:gap-[15px]">
          <span className="workspace-name flex items-center font-medium text-[#d8dae1] max-[390px]:text-[11px] max-[390px]:gap-[5px] min-[390px]:max-[720px]:text-[12px] min-[390px]:max-[720px]:gap-[7px] min-[720px]:text-[13px] min-[720px]:gap-[9px] max-[720px]:w-auto max-[720px]:flex-1 min-[720px]:max-[1100px]:w-44 min-[1100px]:w-50.5 max-[720px]:[&>svg]:ml-0 min-[720px]:[&>svg]:ml-auto [&>svg]:text-[#9297a3]">
            <span className="square-icon flex items-center justify-center rounded-[6px] bg-[#ffffff06] text-[#e4e8f0] border border-[#30343d] max-[720px]:w-[23px] max-[720px]:h-[23px] min-[720px]:w-6.5 min-[720px]:h-6.5">
              <AudioLines size={17} />
            </span>{" "}
            Acme workspace <ChevronDown size={11} />
          </span>
          <span className="app-breadcrumb max-[720px]:hidden min-[720px]:flex items-center text-[12px] text-[#9297a3] gap-[9px]">
            Agents <ChevronRight size={12} /> Support assistant
          </span>
          <a
            href="/login"
            className="app-create flex items-center rounded-[4px] ml-auto text-[#cacdd7] bg-[#ffffff03] py-[5px] border border-[#30343d] max-[390px]:text-[9px] max-[390px]:gap-1 min-[390px]:max-[720px]:text-[10px] min-[390px]:max-[720px]:gap-[5px] min-[720px]:text-[11px] min-[720px]:px-2 min-[720px]:gap-2 max-[720px]:px-1.5 hover:bg-[#ffffff08]"
          >
            Create your agent <ArrowUpRight size={12} />
          </a>
        </div>
        <div
          className="mobile-product-tabs max-[720px]:flex max-[720px]:border-b max-[720px]:border-b-[#22252b] max-[720px]:bg-[#101217] max-[720px]:px-3 max-[720px]:py-[7px] max-[720px]:gap-2 min-[720px]:hidden max-[720px]:[&_button]:flex max-[720px]:[&_button]:items-center max-[720px]:[&_button]:text-[11px] max-[720px]:[&_button]:rounded-[4px] max-[720px]:[&_button]:text-[#9297a3] max-[720px]:[&_button]:px-[9px] max-[720px]:[&_button]:py-1.5 max-[720px]:[&_button]:border max-[720px]:[&_button]:border-[transparent] max-[720px]:[&_button]:border-solid max-[720px]:[&_button]:gap-1.5 max-[720px]:[&_button[aria-pressed='true']]:text-[#d4dbe6] max-[720px]:[&_button[aria-pressed='true']]:bg-[#ffffff06] max-[720px]:[&_button[aria-pressed='true']]:border-[#22252b]"
          role="group"
          aria-label="Demo panels"
        >
          <button
            onClick={() => setActivePanel("chat")}
            aria-pressed={activePanel === "chat"}
          >
            <MessageSquare size={14} /> Conversation
          </button>
          <button
            onClick={() => setActivePanel("knowledge")}
            aria-pressed={activePanel === "knowledge"}
          >
            <BookOpen size={14} /> Knowledge
          </button>
        </div>
        <div className="app-body max-[720px]:block max-[720px]:min-h-152.5 min-[720px]:grid min-[720px]:min-h-147.5 [@media(width<721px)]:[grid-template-columns:190px_minmax(0,1fr)] min-[721px]:max-[900px]:[grid-template-columns:205px_minmax(0,1fr)] min-[900px]:max-[1100px]:[grid-template-columns:192px_minmax(0,1fr)_210px] min-[1100px]:[grid-template-columns:232px_minmax(0,1fr)_250px]">
          <aside className="source-pane max-[720px]:pt-5 max-[720px]:hidden max-[720px]:min-h-152.5 max-[720px]:px-4 max-[720px]:border-0 max-[720px]:border-[currentColor] max-[720px]:border-none min-[720px]:pt-5.5 min-[720px]:border-r min-[720px]:border-r-[#22252b] min-[720px]:flex min-[720px]:max-[900px]:px-3 min-[900px]:max-[1100px]:px-2.5 min-[1100px]:px-3.5 pb-0 flex-col bg-[#111318] min-w-0">
            <div className="pane-label max-[720px]:text-[11px] min-[720px]:text-[10px] font-medium tracking-[.1em] text-[#9297a3] mb-[11px] flex items-center justify-between px-2 py-0 max-[720px]:[&>span]:text-[11px] min-[720px]:[&>span]:text-[10px] [&>span]:tracking-[0] [&>span]:font-normal">
              YOUR AGENT
            </div>
            <div className="agent-menu selected flex items-center min-h-8 text-[#9297a3] rounded-[4px] px-2 py-0 gap-2 max-[720px]:text-[13px] min-[720px]:text-[12px] [&.selected]:text-[#e0e2e9] [&.selected]:bg-[#16191f] [&>span]:ml-auto [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 [&:not(.selected):hover]:bg-[#ffffff04] [&:not(.selected):hover]:text-[#f1f2f4]">
              <MessageSquare size={14} /> Support assistant{" "}
              <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />
            </div>
            <a
              className="agent-menu flex items-center min-h-8 text-[#9297a3] rounded-[4px] px-2 py-0 gap-2 max-[720px]:text-[13px] min-[720px]:text-[12px] [&.selected]:text-[#e0e2e9] [&.selected]:bg-[#16191f] [&>span]:ml-auto [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 [&:not(.selected):hover]:bg-[#ffffff04] [&:not(.selected):hover]:text-[#f1f2f4]"
              href="#inbox"
            >
              <Inbox size={14} /> Live inbox <span>↗</span>
            </a>
            <div className="pane-label knowledge-label max-[720px]:text-[11px] min-[720px]:text-[10px] font-medium tracking-[.1em] text-[#9297a3] mb-[11px] flex items-center justify-between mt-8 px-2 py-0 max-[720px]:[&>span]:text-[11px] min-[720px]:[&>span]:text-[10px] [&>span]:tracking-[0] [&>span]:font-normal">
              KNOWLEDGE <span>3 sources</span>
            </div>
            <div className="source-list flex flex-col gap-[5px] [&_button]:flex [&_button]:items-center [&_button]:text-left [&_button]:rounded-[5px] [&_button]:w-full [&_button]:text-[#a2a5af] [&_button]:[transition:background_.18s,border-color_.18s] [&_button]:border [&_button]:border-[transparent] [&_button]:border-solid [&_button]:gap-[9px] max-[720px]:[&_button]:min-h-15 max-[720px]:[&_button]:p-2.5 min-[720px]:[&_button]:min-h-[53px] min-[720px]:[&_button]:py-[9px] min-[720px]:max-[1100px]:[&_button]:px-1.5 min-[1100px]:[&_button]:px-2 [&_button>span]:min-w-0 [&_button>span]:flex-1 [&_button>span]:whitespace-nowrap [&_button>span]:overflow-x-hidden [&_button>span]:overflow-y-hidden [&_button>span]:text-ellipsis max-[720px]:[&_button>span]:text-[14px] min-[720px]:max-[900px]:[&_button>span]:text-[12px] min-[900px]:max-[1100px]:[&_button>span]:text-[11px] min-[1100px]:[&_button>span]:text-[12px] [&_small]:block [&_small]:tracking-[.08em] [&_small]:text-[#9297a3] [&_small]:mt-1 max-[720px]:[&_small]:text-[10px] min-[720px]:[&_small]:text-[9px] [&_button>svg:last-child]:text-[#91b7a2] [&_button>svg:last-child]:w-2.5 [&_button[aria-pressed='true']]:text-[#e5e8ed] [&_button[aria-pressed='true']]:bg-[#91a6c80b] [&_button[aria-pressed='true']]:border-[#91a6c82b] [&_button:hover]:bg-[#ffffff08] [&_button_>_svg:first-child]:[transition:translate_200ms_cubic-bezier(.22,1,.36,1)] motion-reduce:[&_button_>_svg:first-child]:[translate:none]! [&_button:hover_>_svg:first-child]:[translate:1px_0] [&_button:focus-visible_>_svg:first-child]:[translate:1px_0] [&_button:active]:bg-[#ffffff0b]">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  aria-pressed={reply.scenario.id === s.id}
                  onClick={() => showScenario(s)}
                >
                  {i === 0 ? (
                    <FileText size={16} />
                  ) : i === 1 ? (
                    <Globe size={16} />
                  ) : (
                    <BookOpen size={16} />
                  )}
                  <span>
                    {s.label}
                    <small>{s.type}</small>
                  </span>
                  <Check size={12} />
                </button>
              ))}
            </div>
            <a
              href="/dashboard/settings"
              className="source-manage flex items-center justify-between text-[#9297a3] mt-4.5 mb-0 mx-2 max-[720px]:text-[12px] min-[720px]:text-[11px] hover:text-[#f1f2f4]"
            >
              Manage knowledge <ArrowUpRight size={12} />
            </a>
            <div className="source-foot mt-auto mb-0 pt-[35px] pb-5 flex items-start text-[#8f96a5] px-0 mx-2 gap-2 max-[720px]:[&_p]:text-[12px] min-[720px]:[&_p]:text-[11px] [&_p]:leading-[1.8]">
              <ShieldCheck size={14} />
              <p>
                Your content is the
                <br />
                foundation of every answer.
              </p>
            </div>
            <div className="workspace-person flex items-center border-t border-t-[#22252b] mt-0 px-[7px] py-[15px] gap-2 [&>span]:w-[23px] [&>span]:h-[23px] [&>span]:bg-[#ffffff06] [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:rounded-[4px] [&>span]:text-[10px] [&>span]:text-[#c7cad4] [&>span]:border [&>span]:border-[#30343d] [&>span]:border-solid [&>div]:flex-1 [&>div]:text-[#c3c6d0] max-[720px]:[&>div]:text-[12px] min-[720px]:[&>div]:text-[11px] [&_small]:text-[10px] [&_small]:block [&_small]:text-[#9297a3] [&>svg]:text-[#9297a3]">
              <span>AC</span>
              <div>
                Acme workspace<small>Sample knowledge base</small>
              </div>
              <Settings2 size={14} />
            </div>
          </aside>
          <div className="conversation-pane bg-[#0d0f12] flex flex-col min-w-0 max-[720px]:min-h-152.5">
            <div className="conversation-toolbar max-[720px]:h-10.5 max-[720px]:px-3.5 min-[720px]:h-11.5 border-b border-b-[#22252b] flex items-center justify-between py-0 min-[720px]:max-[900px]:px-5 min-[900px]:px-5.5 [&>div]:flex [&>div]:items-center [&>div]:text-[#b8bcc8] max-[720px]:[&>div]:text-[10px] max-[720px]:[&>div]:gap-1.5 min-[720px]:[&>div]:text-[11px] min-[720px]:[&>div]:gap-2 [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 [&_.slash]:text-[#4c505a] [&_.slash]:mx-0.5 [&_.slash]:my-0 [&>div>span:last-child]:text-[#9297a3] max-[720px]:[&>div>span:last-child]:text-[10px]">
              <div>
                <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
                Playground <span className="slash">/</span>
                <span>Support assistant</span>
              </div>
              <button
                className="icon-button flex items-center justify-center w-7.5 h-7.5 rounded-[4px] text-[#9297a3] hover:bg-[#ffffff08] hover:text-[#f1f2f4]"

                aria-label="Replay the demo conversation"
                onClick={() => showScenario(SCENARIOS[0])}
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <div
              className="demo-chat max-[720px]:h-115 max-[720px]:px-[15px] max-[720px]:py-5 max-[720px]:gap-5.5 min-[720px]:max-[900px]:h-[355px] min-[720px]:max-[900px]:px-[23px] min-[900px]:h-107.5 overflow-y-auto flex flex-col [scrollbar-width:thin] [scrollbar-color:#363841_transparent] [scrollbar-gutter:stable] min-[720px]:pt-[23px] min-[720px]:pb-[15px] min-[720px]:gap-[23px] min-[900px]:max-[1100px]:px-[19px] min-[1100px]:px-6.5"
              aria-busy="false"
              ref={chat}
            >
              <div className="chat-conversation-label max-[720px]:text-[8px] max-[720px]:tracking-[.07em] min-[720px]:text-[9px] min-[720px]:tracking-[.13em] text-[#9297a3] text-center">
                A CONVERSATION, BACKED BY YOUR KNOWLEDGE
              </div>
              <div className="assistant-welcome flex items-start gap-[11px] [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#d6dae4] [&_p]:text-[13px] [&_p]:text-[#a7acb8] [&_p]:mt-[3px]">
                <span className="assistant-mark w-[25px] h-[25px] flex items-center justify-center rounded-[6px] bg-[#ffffff04] text-[#cbd2e0] shrink-0 border border-[#30343d]">
                  <AudioLines size={18} />
                </span>
                <div>
                  <strong>Support assistant</strong>
                  <p>Hi there. What can I help you with?</p>
                </div>
              </div>
              <div className="customer-message flex items-start self-end max-w-[92%] gap-2.5 [&>span:first-child]:text-[13px] [&>span:first-child]:leading-[1.8] [&>span:first-child]:bg-[#1b1d24] [&>span:first-child]:rounded-[7px_7px_2px_7px] [&>span:first-child]:text-[#dce0e9] [&>span:first-child]:py-2.5 [&>span:first-child]:border [&>span:first-child]:border-[#ffffff06] [&>span:first-child]:border-solid max-[720px]:[&>span:first-child]:px-3 min-[720px]:[&>span:first-child]:px-[13px]">
                <span>{reply.question}</span>
                <span className="customer-avatar w-6 h-6 rounded-full bg-[#252833] text-[#b6becf] flex items-center justify-center text-[10px]">
                  You
                </span>
              </div>
              <div className="assistant-response flex items-start gap-[11px] [&>div]:flex-1 [&>div]:min-w-0 [&_p]:text-[13px] [&_p]:leading-[1.85] [&_p]:text-[#b9bec9] max-[720px]:[&_p]:min-h-0 min-[720px]:[&_p]:min-h-[87px]">
                <span className="assistant-mark w-[25px] h-[25px] flex items-center justify-center rounded-[6px] bg-[#ffffff04] text-[#cbd2e0] shrink-0 border border-[#30343d]">
                  <AudioLines size={18} />
                </span>
                <div>
                  <div className="answer-identity text-[12px] font-medium text-[#d7dce6] mb-1.5 [&>span]:text-[10px] [&>span]:font-normal [&>span]:text-[#9297a3]">
                    Support assistant <span>· EchoDesk</span>
                  </div>
                  <p aria-live="polite">{reply.answer}</p>
                  <button
                    className="source-citation flex items-center w-fit rounded-[4px] text-[10px] text-[#91a6c8] mt-[9px] bg-[#ffffff02] px-[7px] py-[5px] border border-[#ffffff17] gap-[5px] hover:bg-[#a9b9d20a] hover:border-[#9ba7bd65]"
                    ref={citation}
                    onClick={() => setContextOpen(!contextOpen)}
                    aria-expanded={contextOpen}
                  >
                    <FileText size={11} />
                    <span>{reply.scenario.label}</span>
                    <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>
              <div className="chat-suggestions flex flex-wrap m-0 gap-[5px] [&_button]:text-[10px] [&_button]:text-[#a0a7b5] [&_button]:flex [&_button]:items-center [&_button]:rounded-[4px] [&_button]:px-[7px] [&_button]:py-[5px] [&_button]:border [&_button]:border-[#22252b] [&_button]:border-solid max-[390px]:[&_button]:gap-1 min-[390px]:max-[720px]:[&_button]:gap-[5px] min-[720px]:[&_button]:min-h-[29px] min-[720px]:[&_button]:gap-[7px] max-[720px]:[&_button]:min-h-8.5 [&_button:hover]:bg-[#ffffff06] [&_button:hover]:text-[#f1f2f4]">
                {SCENARIOS.map((s) => (
                  <button key={s.id} onClick={() => showScenario(s)}>
                    {s.prompt}
                    <ArrowUpRight size={11} />
                  </button>
                ))}
              </div>
            </div>
            <form
              className="demo-input flex items-center mt-auto mb-0 rounded-[6px] bg-[#111318] pr-[5px] pl-[11px] min-h-11.5 py-[5px] border border-[#ffffff23] max-[720px]:mx-3 min-[720px]:mx-4.5 focus-within:border-[#91a6c8] [&_input]:flex-1 [&_input]:[background:none] [&_input]:text-[#f1f2f4] [&_input]:[outline:none] [&_input]:min-h-8 [&_input]:border-0 [&_input]:border-[currentColor] [&_input]:border-none max-[720px]:[&_input]:text-[16px] min-[720px]:[&_input]:text-[12px] [&_input::placeholder]:text-[#858b99] [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:w-[27px] [&_button]:h-[27px] [&_button]:rounded-[4px] [&_button]:bg-[#242831] [&_button]:text-[#c9d1e0] [&_button]:border [&_button]:border-[#ffffff16] [&_button]:border-solid [&_button:hover]:bg-[#323845] [&_button:hover]:text-white"
              onSubmit={handleSubmit}
            >
              <label
                className="sr-only absolute w-px h-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap p-0 m-[-1px] border-0 border-none"
                htmlFor="demo-question"
              >
                Ask about pricing, installation, or knowledge sources
              </label>
              <input
                id="demo-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                name="question"
                placeholder="Ask about your agent…"
                maxLength={200}
                autoComplete="off"
              />
              <button type="submit" aria-label="Send demo question">
                <ArrowUpRight size={16} />
              </button>
            </form>
            <div className="demo-input-note flex items-center pb-3 text-[#9297a3] gap-[5px] max-[720px]:pt-3 max-[720px]:text-[9px] max-[720px]:flex-wrap max-[720px]:px-3 min-[720px]:pt-2.5 min-[720px]:text-[10px] min-[720px]:px-[19px] [&>span]:ml-auto">
              <LockKeyhole size={10} /> Answers use your connected knowledge.
              <span>Scripted demo</span>
            </div>
          </div>
          <aside className="context-pane border-l border-l-[#22252b] pb-0 bg-[#111318] flex-col min-w-0 max-[1100px]:pt-[17px] max-[1100px]:px-3.5 min-[1100px]:pt-4.5 min-[1100px]:px-4.5 max-[900px]:hidden min-[900px]:flex">
            <div className="context-heading flex items-center text-[10px] text-[#a1a7b4] tracking-[.06em] gap-[7px]">
              <Layers size={13} /> RETRIEVED CONTEXT
              <button
                className="context-close max-[900px]:flex min-[900px]:hidden items-center justify-center ml-auto w-6 h-6 text-[#9297a3] rounded-[3px] hover:bg-[#ffffff08] hover:text-[#f1f2f4]"

                aria-label="Close source context"
                onClick={closeContext}
              >
                <X size={12} />
              </button>
            </div>
            <div className="context-document mt-7 mb-[23px] mx-0 [&_strong]:block [&_strong]:text-[14px] [&_strong]:font-medium [&_strong]:text-[#d9dfe9] [&>span:last-child]:block [&>span:last-child]:tracking-[.08em] [&>span:last-child]:text-[#9297a3] [&>span:last-child]:mt-1.5 max-[720px]:[&>span:last-child]:text-[10px] min-[720px]:[&>span:last-child]:text-[9px]">
              <span className="document-large flex items-center justify-center rounded-[7px] bg-[#ffffff03] w-[43px] h-[49px] mb-3.5 text-[#abb5c8] border border-[#30343d]">
                <FileText size={25} />
              </span>
              <strong>{reply.scenario.label}</strong>
              <span>{reply.scenario.type}</span>
            </div>
            <div className="context-section max-[720px]:[&>span]:text-[10px] min-[720px]:[&>span]:text-[9px] [&>span]:tracking-[.1em] [&>span]:text-[#9297a3] max-[720px]:[&_h4]:text-[13px] min-[720px]:[&_h4]:text-[12px] [&_h4]:font-medium [&_h4]:mt-[9px] [&_h4]:text-[#c0c7d4] max-[720px]:[&_p]:text-[13px] min-[720px]:[&_p]:text-[12px] [&_p]:leading-[1.85] [&_p]:text-[#a5adbd] [&_p]:border-l [&_p]:border-l-[#91a6c8] [&_p]:pl-[11px] [&_p]:mt-3">
              <span>RELEVANT EXCERPT</span>
              <h4>{reply.scenario.section}</h4>
              <p>{reply.scenario.excerpt}</p>
            </div>
            <div className="context-connection flex items-center mt-[25px] mb-2.5 mx-0 gap-1 [&>span]:h-0.5 [&>span]:flex-1 [&>span]:bg-[#b5c2d833] [&>span:nth-child(2)]:bg-[#b5c2d866]">
              <span />
              <span />
              <span />
            </div>
            <div className="grounding-label flex items-center text-[10px] text-[#a9b8c5] gap-[5px]">
              <Check size={12} /> Connected to this answer
            </div>
            <div className="context-bottom border-t border-t-[#22252b] mt-auto px-0 py-[17px] max-[720px]:[&>span]:text-[10px] min-[720px]:[&>span]:text-[9px] [&>span]:tracking-[.1em] [&>span]:text-[#9297a3] max-[720px]:[&_p]:text-[13px] min-[720px]:[&_p]:text-[12px] [&_p]:text-[#b1b7c3] [&_p]:leading-[1.8] [&_p]:mt-[5px]">
              <span>THE SHORT VERSION</span>
              <p>
                The right information.
                <br />
                Right behind the answer.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <div className="product-caption flex justify-between pb-4 text-[#9297a3] leading-[1.6] px-0 max-[720px]:items-start max-[720px]:pt-3.5 max-[720px]:text-[10px] max-[720px]:flex-col max-[720px]:gap-[5px] min-[720px]:items-center min-[720px]:pt-4 min-[720px]:text-[11px] min-[720px]:gap-5 [&>span]:flex [&>span]:items-center [&>span]:gap-[7px] [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 [&_.tiny-dot]:bg-[#7a8291] max-[720px]:[&>span:last-child]:max-w-none max-[720px]:[&>span:last-child]:text-[10px] max-[720px]:[&>span:last-child]:gap-1 min-[720px]:max-[900px]:[&>span:last-child]:max-w-60 max-[900px]:[&>span:last-child]:text-right max-[720px]:[&>span:first-child]:max-w-none max-[720px]:[&>span:first-child]:text-[10px]">
        <span>
          <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
          Real product capabilities. Illustrative workspace.
        </span>
        <span>
          Click a source. Ask a question. See the connection.{" "}
          <ArrowUpRight size={11} />
        </span>
      </div>
    </div>
  );
}
