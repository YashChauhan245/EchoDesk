import { ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import { SectionLabel } from "./LandingUI";
import { PLANS } from "./data";

export default function PricingSection() {
  return (
    <section
      className="section ed-container pricing-section max-w-320 w-full m-auto max-[720px]:py-21 min-[720px]:px-8 min-[720px]:py-[clamp(96px,10vw,144px)] max-[390px]:px-5 min-[390px]:max-[720px]:px-6 print:hidden!"
      id="pricing"
    >
      <SectionLabel number="04">ROOM FOR YOUR NEXT CHAPTER</SectionLabel>
      <div className="editorial-heading max-[720px]:block max-[720px]:mb-[29px] min-[720px]:grid min-[720px]:mb-[45px] [grid-template-columns:1.25fr_1fr] items-end max-[900px]:gap-[45px] min-[900px]:gap-20 max-[720px]:[&>p]:text-[14px] max-[720px]:[&>p]:mt-5 min-[720px]:[&>p]:text-[15px] [&>p]:leading-[1.85] [&>p]:text-[#9297a3] [&>p]:pb-0.5 [&>p]:max-w-100 [&>p]:justify-self-end max-[720px]:[&>p_br]:hidden">
        <h2 className="font-medium text-[clamp(34px,4vw,46px)] leading-[1.14] tracking-[-.045em] max-[720px]:text-[clamp(32px,6.2vw,42px)] max-[720px]:tracking-[-.04em]">
          Start with a question.
          <br />
          Grow from there.
        </h2>
        <p>
          Clear monthly plans.
          <br />
          The room you need, when you need it.
        </p>
      </div>
      <div className="pricing-grid grid max-[720px]:[grid-template-columns:1fr] max-[720px]:mt-8 max-[720px]:gap-4 min-[720px]:[grid-template-columns:repeat(3,1fr)] min-[720px]:mt-12.5 min-[720px]:max-[900px]:gap-[11px] min-[900px]:gap-[15px]">
        {PLANS.map((plan, i) => (
          <article
            className={`price-card rounded-[6px] [transition:background-color_220ms_ease,_border-color_220ms_ease] border max-[720px]:px-[25px] max-[720px]:py-7 min-[720px]:max-[721px]:pt-7.5 min-[720px]:max-[721px]:pb-8.5 min-[720px]:max-[721px]:px-[27px] min-[721px]:max-[1100px]:px-5 min-[721px]:max-[1100px]:py-[25px] min-[1100px]:pt-7.5 min-[1100px]:pb-8.5 min-[1100px]:px-[27px] max-[720px]:[&>p]:text-[14px] max-[720px]:[&>p]:mt-[13px] max-[720px]:[&>p]:min-h-0 min-[720px]:[&>p]:text-[13px] min-[720px]:[&>p]:mt-2.5 min-[720px]:[&>p]:min-h-11 [&>p]:text-[#9297a3] [&>.button]:w-full [&>.button]:justify-between [&>.button]:px-[13px] [&>.button]:py-0 max-[720px]:[&>.button]:min-h-11 max-[720px]:[&>.button]:text-[14px] min-[720px]:[&>.button]:min-h-10.5 min-[720px]:[&>.button]:text-[13px] [&_ul]:list-none [&_ul]:pb-0 [&_ul]:mb-0 [&_ul]:border-t [&_ul]:border-t-[#22252b] [&_ul]:flex [&_ul]:flex-col [&_ul]:px-0 [&_ul]:mx-0 max-[720px]:[&_ul]:pt-[25px] max-[720px]:[&_ul]:mt-6.5 max-[720px]:[&_ul]:gap-[15px] min-[720px]:[&_ul]:pt-6 min-[720px]:[&_ul]:mt-6 min-[720px]:[&_ul]:gap-3.5 [&_li]:flex [&_li]:items-start [&_li]:text-[#a9b0bf] [&_li]:leading-[1.7] max-[900px]:[&_li]:gap-1.5 min-[900px]:[&_li]:gap-2 max-[720px]:[&_li]:text-[14px] min-[720px]:max-[721px]:[&_li]:text-[13px] min-[721px]:max-[1100px]:[&_li]:text-[12px] min-[1100px]:[&_li]:text-[13px] [&_li_svg]:text-[#9eacc2] [&_li_svg]:w-3 max-[900px]:[&:not(.price-featured)_.plan-name]:min-h-12.5 hover:bg-[#111318] hover:border-[#ffffff35] [&_li>svg]:mt-1 [&_li>svg]:shrink-0 ${i === 2 ? "price-featured bg-[#111318] border-[#91a6c850] max-[900px]:[&_.plan-name]:min-h-12.5" : "bg-transparent border-[#22252b]"}`}
            key={plan.name}
          >
            <div className="plan-name flex justify-between max-[720px]:items-center max-[720px]:flex-row max-[720px]:min-h-0! min-[720px]:max-[1100px]:items-start min-[1100px]:items-center max-[900px]:gap-2 min-[900px]:gap-2.5 min-[720px]:max-[900px]:flex-col [&_h3]:text-[21px] [@media(width<721px)]:[&>span]:text-[10px] min-[721px]:max-[1100px]:[&>span]:text-[9px] min-[1100px]:[&>span]:text-[10px] [&>span]:rounded-[3px] [&>span]:text-[#b4bfd2] [&>span]:bg-[#b1c3df07] [&>span]:px-1.5 [&>span]:border [&>span]:border-[#b7c3d529] [&>span]:border-solid max-[720px]:[&>span]:min-h-0 max-[720px]:[&>span]:py-1 min-[720px]:[&>span]:py-[3px] min-[720px]:max-[900px]:[&>span]:min-h-[19px]">
              <h3 className="font-medium text-[19px] leading-[1.35] tracking-[-.025em]">
                {plan.name}
              </h3>
              {i === 2 && <span>For busier websites</span>}
            </div>
            <p>{plan.description}</p>
            <div className="plan-price flex items-baseline leading-[1] [font-weight:450] tracking-[-.045em] tabular-nums mx-0 gap-2 max-[720px]:text-[50px] max-[720px]:mt-[29px] max-[720px]:mb-6.5 min-[720px]:text-[52px] min-[720px]:my-[27px] max-[720px]:[&>span]:text-[13px] min-[720px]:[&>span]:text-[12px] [&>span]:font-normal [&>span]:tracking-[0] [&>span]:text-[#9297a3]">
              ₹{plan.price}
              <span>/ month</span>
            </div>
            <a
              href={i === 0 ? "/login" : "/dashboard/pricing"}
              className={`button inline-flex items-center justify-center min-h-10.5 rounded-[6px] text-[14px] font-medium leading-[1.3] whitespace-nowrap [transition:background-color_.18s,border-color_.18s,transform_.18s] px-[17px] py-0 border gap-[15px] [&_svg]:[transition:transform_.2s] [&:hover_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:hover_svg]:[transform:none]! active:[transform:translateY(1px)] motion-reduce:active:[transform:none]! [&:focus-visible_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:focus-visible_svg]:[transform:none]! ${i === 2 ? "button-primary bg-[#e8e9ed] text-[#131419] [box-shadow:0_1px_0_#ffffff2a_inset] border-[#e8e9ed] hover:bg-white hover:border-[white]" : "button-outline bg-[#ffffff03] text-[#d5d6dc] border-[#30343d] hover:bg-[#ffffff08] hover:border-[#ffffff32]"}`}
            >
              {i === 0 ? "Start free" : `Choose ${plan.name}`}
              <ArrowUpRight size={14} />
            </a>
            <ul>
              {plan.limits.map((limit) => (
                <li key={limit}>
                  <Check size={13} />
                  {limit}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="pricing-footnote flex items-center justify-center text-[#9297a3] gap-[7px] max-[720px]:text-[10px] max-[720px]:mt-[23px] max-[720px]:leading-[1.8] max-[720px]:text-center min-[720px]:text-[11px] min-[720px]:mt-[25px]">
        <LockKeyhole size={11} /> Payments via Razorpay. Manage your plan from
        your dashboard.
      </div>
    </section>
  );
}
