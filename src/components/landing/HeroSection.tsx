import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines } from "lucide-react";
import ProductShowcase from "./ProductShowcase";
import { StartButton } from "./LandingUI";

export default function HeroSection() {
  return (
    <>
      <section
        className="hero ed-container max-w-320 w-full pb-0 m-auto max-[720px]:pt-29 min-[720px]:max-[900px]:pt-33 min-[900px]:max-[1500px]:pt-36.5 min-[1500px]:pt-42.5 max-[390px]:px-5 min-[390px]:max-[720px]:px-6 min-[720px]:px-8 print:hidden! max-[390px]:[&_h1]:text-[36px] min-[390px]:max-[720px]:[&_h1]:text-[clamp(36px,7.5vw,52px)] min-[720px]:max-[721px]:[&_h1]:text-[61px] min-[721px]:max-[1100px]:[&_h1]:text-[clamp(42px,5.15vw,58px)] min-[1100px]:max-[1500px]:[&_h1]:text-[clamp(44px,5.3vw,72px)] min-[1500px]:[&_h1]:text-[72px] max-[720px]:[&_h1]:leading-[1.09] max-[720px]:[&_h1]:tracking-[-.043em] min-[720px]:[&_h1]:leading-[1.06] min-[720px]:[&_h1]:tracking-[-.047em] [&_h1]:font-medium [&_h1_span]:text-[#9297a3]"
        id="top"
      >
        <a
          className="hero-announcement inline-flex items-center leading-[1.5] text-[#9297a3] max-[390px]:text-[8px] max-[390px]:tracking-[0] max-[390px]:gap-1.5 min-[390px]:max-[720px]:text-[9px] min-[390px]:max-[720px]:tracking-[.04em] min-[390px]:max-[720px]:gap-[7px] min-[720px]:text-[10px] min-[720px]:mb-7.5 min-[720px]:tracking-[.075em] min-[720px]:gap-2.5 max-[720px]:mb-6 [&>svg]:ml-1.5 [&>svg]:text-[#9297a3]"
          href="#product"
        >
          <span className="announcement-symbol flex items-center justify-center rounded-[5px] text-[#d4d8e1] bg-[#ffffff03] border border-[#30343d] max-[720px]:w-[21px] max-[720px]:h-[21px] min-[720px]:w-[23px] min-[720px]:h-[23px]">
            <AudioLines size={12} />
          </span>{" "}
          YOUR KNOWLEDGE. YOUR NEXT SUPPORT AGENT.
          <ArrowRight size={12} />
        </a>
        <div className="hero-editorial grid items-end [@media(width<721px)]:[grid-template-columns:1fr] min-[721px]:max-[1100px]:[grid-template-columns:minmax(0,1fr)_280px] min-[721px]:max-[1100px]:gap-8 min-[1100px]:[grid-template-columns:minmax(0,1fr)_330px] max-[720px]:gap-6 min-[720px]:max-[721px]:gap-[25px] min-[1100px]:max-[1500px]:gap-16 min-[1500px]:gap-22.5">
          <h1 className="font-medium">
            AI Customer Support
            <br />
            <span>
              That Actually Knows
              <br />
              Your Business
            </span>
          </h1>
          <div className="hero-aside max-[720px]:block max-[720px]:max-w-107.5 max-[720px]:p-0 min-[720px]:pb-[3px] min-[720px]:max-[900px]:grid max-[900px]:[grid-template-columns:1fr_1fr] max-[900px]:gap-x-10 max-[900px]:items-center max-[720px]:[&>p]:text-[15px] max-[720px]:[&>p]:max-w-105 min-[720px]:max-[721px]:[&>p]:text-[16px] min-[721px]:max-[1100px]:[&>p]:text-[15px] min-[1100px]:[&>p]:text-[16px] [&>p]:leading-[1.8] [&>p]:text-[#9297a3] min-[720px]:[&>p]:max-w-82.5 max-[900px]:[&>p]:[grid-row:1/3]">
            <p>
              Turn your documents, website, and FAQs into a support agent that’s
              always ready to help.
            </p>
            <div className="hero-actions flex flex-wrap items-center max-[390px]:gap-[15px] min-[390px]:max-[720px]:gap-5 min-[720px]:max-[900px]:mt-0 min-[720px]:max-[900px]:justify-end min-[720px]:max-[900px]:gap-[15px] min-[900px]:max-[1100px]:gap-3.5 min-[1100px]:gap-4 max-[720px]:mt-[23px] max-[720px]:justify-start min-[900px]:mt-6 max-[900px]:mb-0 max-[900px]:mx-0 [&_.button]:min-h-11 [&_.button]:py-0 [&_.button]:gap-3 max-[720px]:[&_.button]:px-[15px] min-[720px]:[&_.button]:px-3.5 max-[390px]:[&_.button]:text-[12px] min-[390px]:[&_.button]:text-[13px]">
              <StartButton />
              <a
                className="demo-link [&_svg]:[transition:transform_.2s] flex items-center text-[#b4b6c1] gap-[9px] max-[390px]:text-[12px] min-[390px]:text-[13px] hover:text-white [&:hover_svg]:[transform:translateY(2px)] motion-reduce:[&:hover_svg]:[transform:none]! [&:focus-visible_svg]:[transform:translateY(2px)] motion-reduce:[&:focus-visible_svg]:[transform:none]!"
                href="#product"
              >
                Explore the product <ArrowDown size={14} />
              </a>
            </div>
            <span className="hero-footnote block text-[12px] text-[#9297a3] max-[720px]:mt-3.5 max-[720px]:text-left min-[720px]:max-[900px]:mt-3 min-[720px]:max-[900px]:text-right min-[900px]:mt-4">
              Free to start. One line to embed.
            </span>
          </div>
        </div>
        <ProductShowcase />
      </section>
      <section className="proof-line ed-container max-w-320 w-full mb-auto flex items-center border-b border-b-[#22252b] mx-auto max-[720px]:pt-7 max-[720px]:pb-8 max-[720px]:mt-0 max-[720px]:gap-5.5 min-[720px]:pt-[37px] min-[720px]:pb-11 min-[720px]:mt-2 min-[720px]:px-8 max-[390px]:px-5 min-[390px]:max-[720px]:px-6 [@media(width<721px)]:justify-between min-[721px]:max-[1100px]:justify-center min-[721px]:max-[1100px]:gap-5.5 min-[1100px]:justify-between min-[1100px]:gap-8 min-[720px]:max-[721px]:gap-[25px] max-[1100px]:flex-wrap print:hidden! [&>p]:text-[12px] [&>p]:text-[#9297a3] [&>p]:leading-[1.7] max-[1100px]:[&>p]:max-w-none min-[1100px]:[&>p]:max-w-32.5 max-[720px]:[&>p]:w-full max-[720px]:[&>p]:text-center [&>div]:flex [&>div]:text-[#9da0a9] [&>div]:items-center [&>div]:font-medium [&>div]:tracking-[-.025em] [&>div]:flex-wrap max-[720px]:[&>div]:text-[17px] max-[720px]:[&>div]:justify-center max-[720px]:[&>div]:w-full max-[720px]:[&>div]:gap-4 min-[720px]:[&>div]:text-[18px] min-[720px]:[&>div]:gap-6.5 max-[900px]:[&>a]:text-[11px] max-[900px]:[&>a]:ml-auto min-[900px]:[&>a]:text-[12px] [&>a]:flex [&>a]:items-center [&>a]:text-[#9297a3] [&>a]:whitespace-nowrap [&>a]:gap-1.5 max-[720px]:[&>a]:mr-auto max-[720px]:[&>a]:my-auto [&>a:hover]:text-[#f1f2f4] max-[720px]:[&>div>span+span]:pl-0 max-[720px]:[&>div>span+span]:border-0 max-[720px]:[&>div>span+span]:border-[currentColor] max-[720px]:[&>div>span+span]:border-none min-[720px]:[&>div>span+span]:border-l min-[720px]:[&>div>span+span]:border-l-[#22252b] min-[720px]:[&>div>span+span]:pl-6.5">
        <p>Built on a thoughtful foundation.</p>
        <div>
          <span>Gemini</span>
          <span>MongoDB</span>
          <span>Next.js</span>
          <span>Scalekit</span>
          <span>Razorpay</span>
        </div>
        <a
          href="https://toothly-ai.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="tiny-dot inline-block [vertical-align:middle] w-[5px] h-[5px] rounded-full bg-[#91b7a2] shrink-0" />{" "}
          Live on Toothly <ArrowUpRight size={12} />
        </a>
      </section>
    </>
  );
}
