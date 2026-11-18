import { Layers, LockKeyhole, Settings2 } from "lucide-react";

export default function InfrastructureSection() {
  return (
    <section className="section infrastructure-section max-[720px]:py-21 min-[720px]:py-[clamp(96px,10vw,144px)] border-t border-t-[#22252b] border-b border-b-[#22252b] bg-[#0d0f12] print:hidden!">
      <div className="ed-container infrastructure-grid max-w-320 w-full grid py-0 m-auto max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:[grid-template-columns:1.1fr_1fr] min-[720px]:px-8 max-[720px]:[grid-template-columns:1fr] max-[720px]:gap-[37px] min-[720px]:max-[900px]:gap-12.5 min-[900px]:max-[1100px]:gap-[75px] min-[1100px]:gap-30 max-[720px]:[&_h2]:mt-[21px] min-[720px]:[&_h2]:mt-6.5 max-[720px]:[&>div>p]:mt-[19px] max-[720px]:[&>div>p]:text-[14px] min-[720px]:[&>div>p]:mt-[23px] min-[720px]:[&>div>p]:text-[15px] [&>div>p]:leading-[1.9] [&>div>p]:text-[#9297a3] max-[720px]:[&_.eyebrow]:text-[10px]">
        <div>
          <div className="eyebrow text-[12px] tracking-[.12em] font-medium text-[#9297a3]">
            THOUGHTFUL UNDER THE SURFACE
          </div>
          <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
            Built for the work
            <br />
            you don’t see.
          </h2>
          <p>
            Good support needs more than a good answer.
            <br />
            The details behind it matter, too.
          </p>
        </div>
        <div className="infrastructure-list [&>article]:flex [&>article]:items-start [&>article]:border-b [&>article]:border-b-[#22252b] [&>article]:px-0 max-[720px]:[&>article]:py-[23px] max-[720px]:[&>article]:gap-4 min-[720px]:[&>article]:py-[25px] min-[720px]:[&>article]:gap-4.5 [&>article:first-child]:pt-0 [&>article:last-child]:pb-0 [&>article:last-child]:border-b-[0] [&>article:last-child]:[border-bottom-style:none] [&>article:last-child]:border-b-[currentColor] [&>article>svg]:text-[#939fb4] [&>article>svg]:mt-[3px] max-[720px]:[&_h3]:text-[19px] min-[720px]:max-[900px]:[&_h3]:text-[15px] min-[900px]:[&_h3]:text-[16px] [&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#9297a3] [&_p]:mt-2.5">
          <article>
            <Layers size={19} />
            <div>
              <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
                More than one way to respond.
              </h3>
              <p>
                A five-stage model fallback chain and a local keyword fallback
                add resilience when a model is unavailable.
              </p>
            </div>
          </article>
          <article>
            <LockKeyhole size={19} />
            <div>
              <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
                A considered way to sign in.
              </h3>
              <p>
                SSO and passkeys, powered by Scalekit. Your organization’s
                knowledge and conversations are scoped to your workspace.
              </p>
            </div>
          </article>
          <article>
            <Settings2 size={19} />
            <div>
              <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
                Confidence before you go live.
              </h3>
              <p>
                Explore the sandbox, test important questions, and refine your
                agent before adding it to your website.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
