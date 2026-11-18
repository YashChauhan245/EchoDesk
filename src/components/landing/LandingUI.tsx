import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Brand() {
  return (
    <a
      href="#top"
      className="brand inline-flex items-center shrink-0"
      aria-label="EchoDesk home"
    >
      <span className="logo-crop block relative overflow-hidden ml-[-12px] max-[390px]:w-31.5 max-[390px]:h-[35px] min-[390px]:max-[720px]:w-[135px] min-[390px]:max-[720px]:h-9.5 min-[720px]:w-[145px] min-[720px]:h-10 [&_img]:w-full [&_img]:h-full [&_img]:object-contain [&_img]:[transform:scale(4.7)_translateY(1px)] [&_img]:[filter:brightness(0)_invert(1)]">
        <img src="/logo.png" alt="EchoDesk" />
      </span>
    </a>
  );
}

export function StartButton({
  children = "Start building free",
}: {
  children?: ReactNode;
}) {
  return (
    <a
      href="/login"
      className="button button-primary inline-flex items-center justify-center min-h-10.5 rounded-[6px] text-[14px] font-medium leading-[1.3] whitespace-nowrap [transition:background-color_.18s,border-color_.18s,transform_.18s] bg-[#e8e9ed] text-[#131419] [box-shadow:0_1px_0_#ffffff2a_inset] px-[17px] py-0 border border-[#e8e9ed] gap-[15px] hover:bg-white hover:border-[white] [&_svg]:[transition:transform_.2s] [&:hover_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:hover_svg]:[transform:none]! active:[transform:translateY(1px)] motion-reduce:active:[transform:none]! [&:focus-visible_svg]:[transform:translate(2px,-1px)] motion-reduce:[&:focus-visible_svg]:[transform:none]!"
    >
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}

export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="section-label flex items-center text-[#8d929f] max-[720px]:text-[10px] max-[720px]:tracking-[.06em] max-[720px]:mb-7 max-[720px]:gap-2 min-[720px]:text-[11px] min-[720px]:tracking-[.09em] min-[720px]:mb-9.5 min-[720px]:gap-3 [&>span]:text-[10px] [&>span]:[line-height:normal] [&>span]:font-mono [&>span]:font-normal [&>span]:not-italic [&>span]:text-[#626875] max-[720px]:[&>span]:pr-[3px] min-[720px]:[&>span]:pr-[9px] [&>i]:h-px [&>i]:bg-[#22252b] [&>i]:flex-1 max-[720px]:[&>i]:ml-2 min-[720px]:[&>i]:ml-[25px]">
      <span>{number}</span>
      {children}
      <i />
    </div>
  );
}
