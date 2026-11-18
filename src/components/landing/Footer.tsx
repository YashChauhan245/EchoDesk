import { ArrowUpRight } from "lucide-react";
import { Brand, StartButton } from "./LandingUI";

export default function Footer() {
  return (
    <>
      <section className="final-cta border-t border-t-[#22252b] border-b border-b-[#22252b] bg-[#0d0f12] text-center px-0 max-[720px]:py-20 min-[720px]:py-24 print:hidden! [&_.eyebrow]:flex [&_.eyebrow]:items-center [&_.eyebrow]:justify-center [&_.eyebrow]:gap-2 max-[720px]:[&_.eyebrow]:text-[9px] max-[720px]:[&_.eyebrow]:mb-5.5 max-[720px]:[&_.eyebrow]:tracking-[.08em] min-[720px]:[&_.eyebrow]:text-[10px] min-[720px]:[&_.eyebrow]:mb-6.5 [&_.tiny-dot]:bg-[#98a7bd] [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 max-[720px]:[&_h2]:text-[clamp(30px,6.1vw,42px)] min-[720px]:[&_h2]:text-[clamp(36px,4.1vw,53px)] [&_h2]:leading-[1.2] [&_h2]:[font-weight:450] [&_h2>span]:text-[#8d94a3] max-[720px]:[&_.button]:mt-[27px] max-[720px]:[&_.button]:text-[14px] min-[720px]:[&_.button]:mt-8 [&_p]:text-[12px] [&_p]:text-[#9297a3] [&_p]:mt-[17px]">
        <div className="ed-container final-cta-inner max-w-320 w-full py-0 m-auto max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:px-8">
          <div className="eyebrow text-[12px] tracking-[.12em] font-medium text-[#9297a3]">
            <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
            YOUR KNOWLEDGE HAS MORE TO GIVE.
          </div>
          <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
            Give your customers answers.
            <br />
            <span>Give yourself time back.</span>
          </h2>
          <StartButton>Build your agent for free</StartButton>
          <p>Your docs. Your brand. Your always-on support.</p>
        </div>
      </section>
      <footer className="footer ed-container max-w-320 w-full m-auto max-[720px]:pt-[37px] max-[720px]:pb-5.5 min-[720px]:pt-[55px] min-[720px]:pb-6 min-[720px]:px-8 max-[390px]:px-5 min-[390px]:max-[720px]:px-6 print:hidden!">
        <div className="footer-main grid max-[720px]:[grid-template-columns:repeat(3,1fr)] max-[720px]:gap-y-6.5 max-[720px]:gap-x-4.5 max-[720px]:pb-8 min-[720px]:max-[900px]:[grid-template-columns:1.4fr_1fr_1fr_1fr] min-[720px]:max-[900px]:gap-[25px] min-[900px]:[grid-template-columns:1.8fr_1fr_1fr_1fr] min-[900px]:gap-10 min-[720px]:pb-12 [&>div:first-child>p]:text-[14px] [&>div:first-child>p]:text-[#9297a3] [&>div:first-child>p]:leading-[1.8] max-[720px]:[&>div:first-child>p]:mt-[9px] min-[720px]:[&>div:first-child>p]:mt-3.5 max-[720px]:[&>div:first-child]:[grid-column:1/-1]">
          <div>
            <Brand />
            <p>
              A considered way to be there
              <br />
              for your customers.
            </p>
          </div>
          <div className="footer-link-group flex flex-col gap-[11px] max-[720px]:pt-2 min-[720px]:pt-2.5 max-[720px]:[&>span]:text-[9px] min-[720px]:[&>span]:text-[10px] [&>span]:tracking-[.08em] [&>span]:text-[#737c8c] [&>span]:mb-2 [&>a]:flex [&>a]:items-center [&>a]:text-[#a2aab9] max-[720px]:[&>a]:gap-1 min-[720px]:[&>a]:text-[13px] min-[720px]:[&>a]:gap-[5px] max-[390px]:[&>a]:text-[11px] min-[390px]:max-[720px]:[&>a]:text-[12px] [&>a:hover]:text-[#f1f2f4]">
            <span>PRODUCT</span>
            <a href="#product">Playground</a>
            <a href="#knowledge">Knowledge</a>
            <a href="#inbox">Live inbox</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-link-group flex flex-col gap-[11px] max-[720px]:pt-2 min-[720px]:pt-2.5 max-[720px]:[&>span]:text-[9px] min-[720px]:[&>span]:text-[10px] [&>span]:tracking-[.08em] [&>span]:text-[#737c8c] [&>span]:mb-2 [&>a]:flex [&>a]:items-center [&>a]:text-[#a2aab9] max-[720px]:[&>a]:gap-1 min-[720px]:[&>a]:text-[13px] min-[720px]:[&>a]:gap-[5px] max-[390px]:[&>a]:text-[11px] min-[390px]:max-[720px]:[&>a]:text-[12px] [&>a:hover]:text-[#f1f2f4]">
            <span>EXPLORE</span>
            <a href="#workflow">How it works</a>
            <a href="#faq">FAQ</a>
            <a
              href="https://toothly-ai.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Toothly <ArrowUpRight size={11} />
            </a>
            <a
              href="https://github.com/YashChauhan245/EchoDesk"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="footer-link-group flex flex-col gap-[11px] max-[720px]:pt-2 min-[720px]:pt-2.5 max-[720px]:[&>span]:text-[9px] min-[720px]:[&>span]:text-[10px] [&>span]:tracking-[.08em] [&>span]:text-[#737c8c] [&>span]:mb-2 [&>a]:flex [&>a]:items-center [&>a]:text-[#a2aab9] max-[720px]:[&>a]:gap-1 min-[720px]:[&>a]:text-[13px] min-[720px]:[&>a]:gap-[5px] max-[390px]:[&>a]:text-[11px] min-[390px]:max-[720px]:[&>a]:text-[12px] [&>a:hover]:text-[#f1f2f4]">
            <span>YOUR WORKSPACE</span>
            <a href="/login">Log in</a>
            <a href="/dashboard">
              Dashboard <ArrowUpRight size={11} />
            </a>
            <a href="/login">
              Create an agent <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
        <div className="footer-bottom max-[720px]:grid max-[720px]:pt-5 max-[720px]:text-[10px] max-[720px]:[grid-template-columns:1fr_auto] max-[720px]:gap-2.5 min-[720px]:flex min-[720px]:pt-5.5 min-[720px]:text-[11px] min-[720px]:gap-5 items-center justify-between border-t border-t-[#22252b] text-[#9297a3] [&>span:nth-child(2)]:flex [&>span:nth-child(2)]:items-center [&>span:nth-child(2)]:gap-[7px] max-[720px]:[&>span:nth-child(2)]:[grid-column:1] max-[720px]:[&>span:nth-child(2)]:[grid-row:2] [&_.tiny-dot]:w-1 [&_.tiny-dot]:h-1 [&_.tiny-dot]:bg-[#8493a9]">
          <span>© {new Date().getFullYear()} EchoDesk</span>
          <span>
            <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
            Built for better conversations.
          </span>
        </div>
      </footer>
    </>
  );
}
