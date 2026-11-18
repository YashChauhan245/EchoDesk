"use client";

import {
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  Flag,
  Inbox,
} from "lucide-react";
import { useRef, useState } from "react";
import { THREADS } from "./data";
import { downloadConversation } from "./utils";

export default function InboxPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState(
    "Choose a conversation to explore.",
  );
  const exportButton = useRef<HTMLButtonElement>(null);
  const selectedThread = THREADS[selectedIndex];

  function toggleFlagged() {
    setFlaggedOnly(!flaggedOnly);
    if (!flaggedOnly && !selectedThread.flagged) {
      setSelectedIndex(THREADS.findIndex((thread) => thread.flagged));
    }
  }

  function handleExport(format: "csv" | "json" | "pdf") {
    downloadConversation(selectedThread, format);
    setExportMenuOpen(false);
    setExportStatus(
      "Sample conversation exported as " + format.toUpperCase() + ".",
    );
    exportButton.current?.focus();
  }
  return (
    <div
      className="inbox-frame rounded-[8px] bg-[#111318] overflow-hidden border border-[#30343d] print:border-[0]! print:border-[currentColor]! print:border-none!"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setExportMenuOpen(false);
          exportButton.current?.focus();
        }
      }}
    >
      <div className="inbox-chrome flex items-center justify-between border-b border-b-[#22252b] bg-[#111318] min-h-14 max-[720px]:p-3 min-[720px]:px-4.5 min-[720px]:py-[13px] min-[720px]:gap-4 max-[390px]:gap-1.5 min-[390px]:max-[720px]:gap-2.5 print:hidden! [&>span]:flex [&>span]:items-center [&>span]:text-[#d3d7e0] max-[720px]:[&>span]:text-[13px] max-[720px]:[&>span]:gap-[7px] min-[720px]:[&>span]:text-[14px] min-[720px]:[&>span]:gap-[9px] [&_small]:text-[10px] [&_small]:text-[#9297a3] [&_small]:rounded-[3px] [&_small]:ml-1 [&_small]:px-[5px] [&_small]:py-0.5 [&_small]:border [&_small]:border-[#22252b] [&_small]:border-solid max-[720px]:[&_small]:hidden [&>div]:flex [&>div]:items-center [&>div]:gap-[7px] [&_button]:flex [&_button]:items-center [&_button]:rounded-[4px] [&_button]:text-[#aeb5c3] [&_button]:bg-[#ffffff02] [&_button]:py-0 [&_button]:border [&_button]:border-[#30343d] [&_button]:border-solid max-[720px]:[&_button]:min-h-8.5 max-[720px]:[&_button]:gap-[5px] min-[720px]:[&_button]:min-h-[29px] min-[720px]:[&_button]:px-2 min-[720px]:[&_button]:gap-1.5 max-[390px]:[&_button]:text-[10px] max-[390px]:[&_button]:px-1.5 min-[390px]:max-[720px]:[&_button]:px-[7px] min-[390px]:[&_button]:text-[11px] [&_button:hover]:bg-[#ffffff08] [&_button:hover]:text-[#f1f2f4] [&_button[aria-pressed='true']]:bg-[#ffffff08] [&_button[aria-pressed='true']]:text-[#f1f2f4]">
        <span>
          <Inbox size={15} /> Live inbox <small>Demo workspace</small>
        </span>
        <div>
          <button aria-pressed={flaggedOnly} onClick={toggleFlagged}>
            <Flag size={12} /> Flagged
          </button>
          <div className="export-wrap relative [&>div]:absolute [&>div]:right-0 [&>div]:top-[35px] [&>div]:rounded-[5px] [&>div]:bg-[#1c1f25] [&>div]:min-w-[145px] [&>div]:z-[10] [&>div]:[box-shadow:0_8px_30px_#0007] [&>div]:p-1 [&>div]:border [&>div]:border-[#ffffff23] [&>div]:border-solid [&>div_button]:[background:none] [&>div_button]:rounded-[3px] [&>div_button]:w-full [&>div_button]:text-[12px] [&>div_button]:min-h-[31px] [&>div_button]:border-0 [&>div_button]:border-[currentColor] [&>div_button]:border-none [&>div_button:hover]:bg-[#ffffff08]">
            <button
              aria-expanded={exportMenuOpen}
              ref={exportButton}
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              Export <ChevronDown size={11} />
            </button>
            <div hidden={!exportMenuOpen}>
              <button onClick={() => handleExport("csv")}>Download CSV</button>
              <button onClick={() => handleExport("json")}>
                Download JSON
              </button>
              <button onClick={() => handleExport("pdf")}>Print / PDF</button>
            </div>
          </div>
        </div>
      </div>
      <div className="inbox-columns grid min-h-77.5 max-[720px]:[grid-template-columns:1fr] min-[720px]:max-[900px]:[grid-template-columns:1fr_1.5fr] min-[900px]:[grid-template-columns:.95fr_1.7fr] print:block!">
        <div className="thread-list max-[720px]:border-r-[0] max-[720px]:[border-right-style:none] max-[720px]:border-r-[currentColor] max-[720px]:pt-0 max-[720px]:border-b max-[720px]:border-b-[#22252b] min-[720px]:border-r min-[720px]:border-r-[#22252b] min-[720px]:pt-[7px] print:hidden! [&>button]:flex [&>button]:items-start [&>button]:text-left [&>button]:w-full [&>button]:border-l-[2px] [&>button]:border-l-[transparent] [&>button]:border-b [&>button]:border-b-[#22252b] max-[720px]:[&>button]:min-h-[77px] max-[720px]:[&>button]:p-3.5 max-[720px]:[&>button]:gap-2.5 min-[720px]:max-[900px]:[&>button]:px-[13px] min-[720px]:max-[900px]:[&>button]:py-4.5 min-[720px]:max-[900px]:[&>button]:gap-[9px] min-[900px]:[&>button]:px-[19px] min-[900px]:[&>button]:py-5 min-[900px]:[&>button]:gap-3 min-[720px]:[&>button]:min-h-22 [&>button:hover]:bg-[#ffffff03] [&>button.selected]:border-l-[#bfc8d9] [&>button.selected]:bg-[#b5c2db07] [&>button>span:nth-child(2)]:flex-1 [&>button>span:nth-child(2)]:min-w-0 [&_strong]:block [&_strong]:font-medium [&_strong]:text-[#c9cfdb] [&_strong]:mb-1 max-[900px]:[&_strong]:text-[12px] min-[900px]:[&_strong]:text-[13px] [&_small]:block [&_small]:text-[#909aaa] [&_small]:whitespace-nowrap [&_small]:overflow-x-hidden [&_small]:overflow-y-hidden [&_small]:text-ellipsis max-[720px]:[&_small]:text-[12px] min-[720px]:max-[900px]:[&_small]:text-[11px] min-[900px]:[&_small]:text-[12px] [&_em]:flex [&_em]:items-center [&_em]:mt-2 [&_em]:text-[10px] [&_em]:not-italic [&_em]:text-[#c8ae88] [&_em]:gap-1 [&>button>svg]:text-[#6a7485] [&>button>svg]:mt-2 [&>p]:text-[13px] [&>p]:text-[#9297a3] [&>p]:p-4.5">
          {THREADS.map((thread, i) => (
            <button
              key={thread.initials}

              className={selectedIndex === i ? "selected" : ""}
              aria-pressed={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
              hidden={flaggedOnly && !thread.flagged}
            >
              <span className="thread-avatar flex items-center justify-center shrink-0 bg-[#ffffff05] w-7 h-7 rounded-full text-[10px] text-[#afb8c8] border border-[#ffffff19]">
                {thread.initials}
              </span>
              <span>
                <strong>{thread.topic}</strong>
                <small>{thread.question}</small>
                {thread.flagged && (
                  <em>
                    <Flag size={9} /> Needs a closer look
                  </em>
                )}
              </span>
              <ChevronRight size={12} />
            </button>
          ))}
        </div>
        <div className="thread-detail max-[720px]:min-h-77.5 max-[720px]:px-4 max-[720px]:py-5 max-[720px]:gap-6 min-[720px]:max-[900px]:px-[21px] min-[720px]:max-[900px]:py-[19px] min-[900px]:px-[27px] min-[900px]:py-5 flex flex-col items-start bg-[#0d0f12] min-[720px]:gap-[27px] print:bg-white! print:text-[#111]!">
          <div className="thread-detail-title flex items-center text-[#bdc7d6] w-full gap-[7px] max-[720px]:text-[12px] min-[720px]:max-[900px]:text-[11px] min-[900px]:text-[12px] print:text-[#111]! print:bg-white! [&>span:last-child]:ml-auto [&>span:last-child]:text-[#9297a3] max-[390px]:[&>span:last-child]:text-[9px] min-[390px]:[&>span:last-child]:text-[10px]">
            <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
            Website visitor <span>Demo conversation</span>
          </div>
          <div className="thread-question self-end text-[13px] leading-[1.8] text-[#d1d9e8] bg-[#1b202a] rounded-[6px] px-3.5 py-2.5 border border-[#ffffff0a] max-[720px]:max-w-[90%] min-[720px]:max-w-[85%] print:text-[#111]! print:bg-white!">
            {selectedThread.question}
          </div>
          <div className="thread-answer flex items-start gap-2.5 max-[720px]:max-w-full min-[720px]:max-w-[92%] [&_strong]:text-[12px] [&_strong]:font-medium [&_strong]:text-[#bbc7d9] print:[&_strong]:text-[#111]! print:[&_strong]:bg-white! max-[720px]:[&_p]:text-[13px] min-[720px]:max-[900px]:[&_p]:text-[12px] min-[900px]:[&_p]:text-[13px] [&_p]:leading-[1.95] [&_p]:text-[#9facbf] [&_p]:mt-[7px] print:[&_p]:text-[#111]! print:[&_p]:bg-white! [&_.assistant-mark]:w-[23px] [&_.assistant-mark]:h-[23px]">
            <span className="assistant-mark w-[25px] h-[25px] flex items-center justify-center rounded-[6px] bg-[#ffffff04] text-[#cbd2e0] shrink-0 border border-[#30343d]">
              <AudioLines size={15} />
            </span>
            <div>
              <strong>Support assistant</strong>
              <p>{selectedThread.answer}</p>
            </div>
          </div>
          <div
            className={`thread-resolution flex items-center text-[#8a9aaf] mt-[3px] mr-0 mb-[5px] ml-[33px] gap-1.5 max-[720px]:text-[11px] max-[720px]:leading-[1.6] min-[720px]:text-[10px] print:text-[#555]! [&.flagged]:text-[#c8ae88] ${selectedThread.flagged ? "flagged" : ""}`}
          >
            {selectedThread.flagged ? (
              <>
                <Flag size={12} /> Low confidence · Ready for a closer look.
              </>
            ) : (
              <>
                <Check size={12} /> A helpful answer, with the full context.
              </>
            )}
          </div>
        </div>
      </div>
      <div className="inbox-footer border-t border-t-[#22252b] flex justify-between text-[10px] text-[#9297a3] bg-[#111318] py-3 max-[720px]:flex-col max-[720px]:px-3.5 max-[720px]:gap-[5px] min-[720px]:px-[19px] min-[720px]:gap-5 print:hidden! max-[720px]:[&>span]:max-w-full">
        <span>Stay close to the questions that matter.</span>
        <span role="status">{exportStatus}</span>
      </div>
    </div>
  );
}
