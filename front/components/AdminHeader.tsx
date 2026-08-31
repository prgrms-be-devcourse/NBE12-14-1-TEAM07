"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function AdminHeader() {
  const pathname = usePathname();
  const isOrders = pathname.startsWith("/admin/orders") || pathname === "/admin";
  const isProducts = pathname.startsWith("/admin/products");

  return (
    <header className="bg-white border-b border-line">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-7 py-[18px] border-b border-line">
        <div className="flex items-center gap-3">
          <Logo showSubtitle={false} adminBadge={true} />
        </div>
        <div className="text-[12.5px] text-muted">
          admin@test.com
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex gap-1.5 px-7 pt-3 bg-white">
        <Link
          href="/admin/orders"
          className={`text-[13.5px] px-3.5 py-2.5 transition-colors cursor-pointer ${
            isOrders
              ? "font-bold text-ink border-b-[2.5px] border-ink"
              : "font-semibold text-faint hover:text-ink"
          }`}
        >
          주문 관리
        </Link>
        <Link
          href="/admin/products"
          className={`text-[13.5px] px-3.5 py-2.5 transition-colors cursor-pointer ${
            isProducts
              ? "font-bold text-ink border-b-[2.5px] border-ink"
              : "font-semibold text-faint hover:text-ink"
          }`}
        >
          상품 관리
        </Link>
      </div>
    </header>
  );
}
