"use client";
import { EMBED } from "./data";

import {
  Check,
  Code2,
  Copy,
  FileText,
  SlidersHorizontal,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";
import EmbedPreview from "./EmbedPreview";
import { SectionLabel } from "./LandingUI";

export default function WorkflowSection() {
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(EMBED);
      setCopied(true);
      setCopyStatus(
        "Script copied. Replace your_org_id with your dashboard’s organization ID.",
      );
    } catch {
      setCopyStatus("Copy your embed script from the EchoDesk dashboard.");
    }
  }
  return (
    <section
      className="section workflow-section max-[720px]:py-21 min-[720px]:py-[clamp(96px,10vw,144px)] bg-[#0d0f12] border-t border-t-[#22252b] border-b border-b-[#22252b] print:hidden!"
      id="workflow"
    >
      <div className="ed-container max-w-320 w-full py-0 m-auto max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:px-8">
        <SectionLabel number="02">FROM YOUR DOCS TO YOUR WEBSITE</SectionLabel>
        <div className="editorial-heading max-[720px]:block max-[720px]:mb-[29px] min-[720px]:grid min-[720px]:mb-[45px] [grid-template-columns:1.25fr_1fr] items-end max-[900px]:gap-[45px] min-[900px]:gap-20 max-[720px]:[&>p]:text-[14px] max-[720px]:[&>p]:mt-5 min-[720px]:[&>p]:text-[15px] [&>p]:leading-[1.85] [&>p]:text-[#9297a3] [&>p]:pb-0.5 [&>p]:max-w-100 [&>p]:justify-self-end max-[720px]:[&>p_br]:hidden">
          <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
            A small setup.
            <br />A lasting difference.
          </h2>
          <p>
            There’s no support flow to draw from scratch.
            <br />
            Start with your content. Make it your own.
            <br />
            Meet your customers where they already are.
          </p>
        </div>
        <div className="workflow-grid grid rounded-[7px] overflow-hidden border border-[#22252b] max-[720px]:[grid-template-columns:1fr] max-[720px]:mt-7.5 min-[720px]:[grid-template-columns:repeat(3,1fr)] min-[720px]:mt-10.5 max-[720px]:[&>article]:border-r-[0] max-[720px]:[&>article]:[border-right-style:none] max-[720px]:[&>article]:border-r-[currentColor] max-[720px]:[&>article]:border-b max-[720px]:[&>article]:border-b-[#22252b] max-[720px]:[&>article]:px-6 max-[720px]:[&>article]:py-7 min-[720px]:max-[721px]:[&>article]:px-[27px] min-[720px]:max-[721px]:[&>article]:py-7.5 min-[721px]:max-[1100px]:[&>article]:px-5 min-[721px]:max-[1100px]:[&>article]:py-6 min-[1100px]:[&>article]:px-[27px] min-[1100px]:[&>article]:py-7.5 min-[720px]:[&>article]:border-r min-[720px]:[&>article]:border-r-[#22252b] [&>article]:min-w-0 [&>article:last-child]:border-r-[0] [&>article:last-child]:[border-right-style:none] [&>article:last-child]:border-r-[currentColor] max-[720px]:[&>article:last-child]:border-b-[0] max-[720px]:[&>article:last-child]:[border-bottom-style:none] max-[720px]:[&>article:last-child]:border-b-[currentColor] max-[720px]:[&_h3]:text-[22px] min-[720px]:max-[721px]:[&_h3]:text-[21px] min-[721px]:max-[1100px]:[&_h3]:text-[19px] min-[1100px]:[&_h3]:text-[21px] [@media(width<721px)]:[&_p]:text-[14px] min-[721px]:max-[1100px]:[&_p]:text-[13px] min-[721px]:max-[1100px]:[&_p]:min-h-31.5 min-[1100px]:[&_p]:text-[14px] min-[1100px]:[&_p]:min-h-25 [&_p]:leading-[1.85] [&_p]:text-[#9297a3] [&_p]:mt-3 max-[720px]:[&_p]:min-h-0 min-[720px]:max-[721px]:[&_p]:min-h-25 [&_>_article]:[transition:background-color_220ms_ease] [&_>_article:hover]:bg-[#ffffff02] [&_>_article:hover_.workflow-step_>_svg]:[translate:0_-2px]">
          <article>
            <div className="workflow-step flex justify-between items-center text-[#8f98a8] max-[720px]:mb-[21px] min-[720px]:mb-[27px] max-[720px]:[&>span]:text-[12px] min-[720px]:[&>span]:text-[11px] [&>span]:[line-height:normal] [&>span]:font-mono [&>span]:font-normal [&>span]:not-italic [&>span]:text-[#707b8b] [&_>_svg]:[transition:translate_200ms_cubic-bezier(.22,1,.36,1)] motion-reduce:[&_>_svg]:[translate:none]!">
              <span>01</span>
              <UploadCloud size={19} />
            </div>
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              Add your knowledge.
            </h3>
            <p>
              Connect your website, upload a PDF, or paste the answers your team
              writes every day.
            </p>
            <div className="upload-mini flex items-center rounded-[5px] bg-[#ffffff02] mt-5.5 h-31 text-[#b2b9c6] border border-[#ffffff20] border-dashed max-[720px]:p-4.5 max-[720px]:gap-3.5 min-[720px]:max-[900px]:px-[11px] min-[720px]:max-[900px]:py-[15px] min-[720px]:max-[900px]:gap-2 min-[900px]:px-3.5 min-[900px]:py-5 min-[900px]:gap-3 max-[720px]:[&>span]:text-[13px] min-[720px]:max-[900px]:[&>span]:text-[11px] min-[900px]:[&>span]:text-[12px] [&>span]:leading-[1.7] [&>svg:first-child]:text-[#8794a9] max-[720px]:[&>svg:first-child]:w-[21px] min-[720px]:max-[900px]:[&>svg:first-child]:w-4 [&>svg:last-child]:ml-auto [&>svg:last-child]:text-[#8a9f94]">
              <FileText size={18} />
              <span>
                Everything your agent
                <br />
                needs to know.
              </span>
              <Check size={13} />
            </div>
          </article>
          <article>
            <div className="workflow-step flex justify-between items-center text-[#8f98a8] max-[720px]:mb-[21px] min-[720px]:mb-[27px] max-[720px]:[&>span]:text-[12px] min-[720px]:[&>span]:text-[11px] [&>span]:[line-height:normal] [&>span]:font-mono [&>span]:font-normal [&>span]:not-italic [&>span]:text-[#707b8b] [&_>_svg]:[transition:translate_200ms_cubic-bezier(.22,1,.36,1)] motion-reduce:[&_>_svg]:[translate:none]!">
              <span>02</span>
              <SlidersHorizontal size={19} />
            </div>
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              Give it your voice.
            </h3>
            <p>
              Set the greeting, choose your colors, and test a conversation in
              your sandbox.
            </p>
            <div className="appearance-mini mt-5.5 h-31 rounded-[5px] bg-[#ffffff02] py-3 border border-[#22252b] max-[720px]:px-[15px] min-[720px]:px-3 [&>span]:text-[10px] [&>span]:text-[#9297a3] max-[720px]:[&>div:nth-child(2)]:text-[13px] min-[720px]:[&>div:nth-child(2)]:text-[11px] [&>div:nth-child(2)]:rounded-[3px] [&>div:nth-child(2)]:text-[#b5bbc7] [&>div:nth-child(2)]:mt-[5px] [&>div:nth-child(2)]:px-2 [&>div:nth-child(2)]:py-1.5 [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-[#22252b] [&>div:nth-child(2)]:border-solid">
              <span>Welcome message</span>
              <div>Hi there. How can we help?</div>
              <div
                className="appearance-swatches flex items-center mt-3 gap-[5px] max-[720px]:[&_i]:w-2.5 max-[720px]:[&_i]:h-2.5 min-[720px]:[&_i]:w-[9px] min-[720px]:[&_i]:h-[9px] [&_i]:rounded-full [&_i]:bg-[#c3cad8] [&_i:nth-child(2)]:bg-[#777c88] [&_i:nth-child(3)]:bg-[#3d434f] [&>span]:ml-1 [&>span]:text-[#9297a3] max-[720px]:[&>span]:text-[10px] min-[720px]:[&>span]:text-[9px]"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <span>Your brand. Your welcome.</span>
              </div>
            </div>
          </article>
          <article>
            <div className="workflow-step flex justify-between items-center text-[#8f98a8] max-[720px]:mb-[21px] min-[720px]:mb-[27px] max-[720px]:[&>span]:text-[12px] min-[720px]:[&>span]:text-[11px] [&>span]:[line-height:normal] [&>span]:font-mono [&>span]:font-normal [&>span]:not-italic [&>span]:text-[#707b8b] [&_>_svg]:[transition:translate_200ms_cubic-bezier(.22,1,.36,1)] motion-reduce:[&_>_svg]:[translate:none]!">
              <span>03</span>
              <Code2 size={19} />
            </div>
            <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
              Make yourself available.
            </h3>
            <p>
              One script brings your support agent to your website. No custom
              integration to build.
            </p>
            <div className="embed-mini rounded-[5px] bg-[#101215] mt-5.5 h-31 overflow-hidden border border-[#22252b] [&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:border-b [&>div]:border-b-[#22252b] [&>div]:text-[10px] [&>div]:[line-height:normal] [&>div]:font-mono [&>div]:font-normal [&>div]:not-italic [&>div]:text-[#9297a3] [&>div]:px-2.5 [&>div]:py-[7px] [&>div]:gap-2.5 [&_button]:flex [&_button]:items-center [&_button]:text-[10px] [&_button]:[line-height:normal] [&_button]:font-sans [&_button]:font-normal [&_button]:not-italic [&_button]:text-[#b9c3d4] [&_button]:min-h-5 [&_button]:gap-[5px] max-[720px]:[&_pre]:text-[11px] max-[720px]:[&_pre]:ml-[15px] min-[720px]:[&_pre]:text-[10px] min-[720px]:[&_pre]:ml-3 [&_pre]:leading-[1.8] [&_pre]:font-mono [&_pre]:font-normal [&_pre]:not-italic [&_pre]:text-[#b1bdd2] [&_pre]:mr-3 [&_pre]:whitespace-pre-wrap [&_pre]:[overflow-wrap:anywhere] [&_pre]:my-2.5">
              <div>
                <span>embed.html</span>
                <button
                  aria-label="Copy the widget script"
                  onClick={copyScript}
                >
                  <Copy size={12} />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre>
                <code>
                  &lt;script src=&quot;…/chatbot.js&quot;{`\n`}{" "}
                  data-org-id=&quot;your_org_id&quot;&gt;{`\n`}
                  &lt;/script&gt;
                </code>
              </pre>
            </div>
          </article>
        </div>
        <EmbedPreview />
        <span
          className="copy-status block text-center text-[#9297a3] min-h-4 mt-3.5 max-[720px]:text-[10px] max-[720px]:leading-[1.8] min-[720px]:text-[12px]"
          role="status"
        >
          {copyStatus}
        </span>
      </div>
    </section>
  );
}
