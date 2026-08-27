import Link from "next/link";

interface LogoProps {
  showSubtitle?: boolean;
  adminBadge?: boolean;
}

export default function Logo({ showSubtitle = true, adminBadge = false }: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 no-underline group cursor-pointer">
      <div className="flex items-center">
        {/* Square */}
        <span className="w-[13px] h-[13px] border-[2.5px] border-ink inline-block" />
        {/* Circle */}
        <span className="w-[13px] h-[13px] border-[2.5px] border-ink rounded-full -ml-[5px] bg-white inline-block" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-extrabold tracking-[-0.02em] text-[19px] text-ink">
          Grids &amp; Circles
        </span>
        {showSubtitle && (
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-faint uppercase">
            COFFEE ROASTERS
          </span>
        )}
        {adminBadge && (
          <span className="text-[11px] font-bold tracking-[0.08em] bg-ink text-white px-2 py-0.5 rounded-[5px]">
            관리자
          </span>
        )}
      </div>
    </Link>
  );
}
