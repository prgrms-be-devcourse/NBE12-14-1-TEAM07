"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import StatusPill from "@/components/StatusPill";
import { fetchOrders, completeOrders } from "@/lib/api";
import { OrdersDto } from "@/lib/types";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@test.com";

interface AdminOrderRow {
  id: string;
  email: string;
  items: string;
  amount: string;
  time: string;
  createDate: string;
  status: "처리 가능" | "처리 완료";
}

function toAdminOrderRow(o: OrdersDto): AdminOrderRow {
  const activeDetails = o.ordersDetails.filter((d) => d.status !== "CANCELED");
  const total = activeDetails.reduce((sum, d) => sum + d.totalPrice, 0);

  return {
    id: String(o.id),
    email: o.email,
    items: `상품 ${activeDetails.length}건`,
    amount: `${total.toLocaleString("ko-KR")}원`,
    time: o.createDate.split("T")[1].slice(0, 5),
    createDate: o.createDate,
    status: o.orderStatus === "COMPLETED" ? "처리 완료" : "처리 가능",
  };
}

function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("전체");
  const [deliveryDate, setDeliveryDate] = useState<string>(todayString());
  const [dateOrder, setDateOrder] = useState<"desc" | "asc">("desc");
  const [activeSort, setActiveSort] = useState<"date" | "status">("date");
  const [statusOrder, setStatusOrder] = useState<"ready-first" | "completed-first">("ready-first");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders(ADMIN_EMAIL, deliveryDate);
        setOrders(data.map(toAdminOrderRow));
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [deliveryDate]);

  // Filter calculations
  const totalCount = orders.length;
  const completedCount = orders.filter((r) => r.status === "처리 완료").length;
  const readyCount = orders.filter((r) => r.status === "처리 가능").length;

  const sortedOrders = [...orders].sort((a, b) => {
    const dateDiff = new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
    const timeOrdered = dateOrder === "desc" ? -dateDiff : dateDiff;

    if (activeSort === "status") {
      const rank = (s: AdminOrderRow["status"]) =>
        statusOrder === "ready-first"
          ? s === "처리 가능" ? 0 : 1
          : s === "처리 완료" ? 0 : 1;
      const statusDiff = rank(a.status) - rank(b.status);
      return statusDiff !== 0 ? statusDiff : timeOrdered;
    }

    return timeOrdered;
  });

  const filteredOrders = sortedOrders.filter((r) => {
    if (filter === "전체") return true;
    return r.status === filter;
  });

  // Batch process all ready orders for the selected delivery date
  const handleBatchProcess = async () => {
    if (readyCount === 0) {
      alert("현재 처리 가능한 주문이 없습니다.");
      return;
    }
    try {
      const count = await completeOrders(ADMIN_EMAIL, deliveryDate);
      alert(`처리 가능한 ${count}건의 주문이 일괄 처리 완료되었습니다.`);
      const data = await fetchOrders(ADMIN_EMAIL, deliveryDate);
      setOrders(data.map(toAdminOrderRow));
    } catch {
      alert("일괄 처리에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas p-0 sm:p-6 md:p-8 flex justify-center items-start">
      {/* 1180px Main Container */}
      <div className="w-full max-w-[1180px] bg-page border border-line rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        {/* Admin Header */}
        <AdminHeader />

        {/* Toolbar & Date */}
        <div className="p-[26px_28px_0]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-semibold text-muted">
                배송일
              </span>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="h-[42px] px-4 bg-white border border-field rounded-[9px] text-[14px] font-semibold text-ink shadow-2xs cursor-pointer focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <div className="font-mono text-[11.5px] text-faint">
              처리 기준 · 당일 14:00
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveSort("date");
                setDateOrder((prev) => (prev === "desc" ? "asc" : "desc"));
              }}
              className={`h-[42px] px-4 border rounded-[9px] text-[13px] font-semibold transition-colors cursor-pointer ${
                activeSort === "date"
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink border-field hover:bg-hover"
              }`}
            >
              {dateOrder === "desc" ? "최신순" : "오래된순"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeSort !== "status") {
                  setActiveSort("status");
                } else {
                  setStatusOrder((prev) =>
                    prev === "ready-first" ? "completed-first" : "ready-first"
                  );
                }
              }}
              className={`h-[42px] px-4 border rounded-[9px] text-[13px] font-semibold transition-colors cursor-pointer ${
                activeSort === "status"
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink border-field hover:bg-hover"
              }`}
            >
              {statusOrder === "ready-first" ? "처리 가능 우선" : "처리 완료 우선"}
            </button>
            <div className="hidden sm:block flex-1" />
            <button
              type="button"
              onClick={handleBatchProcess}
              className="h-[42px] px-5 bg-ink text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-black active:scale-[0.99] transition-all cursor-pointer"
            >
              일괄 처리
            </button>
          </div>

          {/* 3 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4.5">
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">배송 건수</div>
              <div className="text-[23px] font-extrabold tracking-[-0.01em] text-ink mt-1">
                {totalCount}건
              </div>
            </div>
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">처리 완료</div>
              <div className="text-[23px] font-extrabold tracking-[-0.01em] text-ok-fg mt-1">
                {completedCount}건
              </div>
            </div>
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">처리 가능</div>
              <div className="text-[23px] font-extrabold tracking-[-0.01em] text-info-fg mt-1">
                {readyCount}건
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4.5">
            {[
              { label: "전체", count: totalCount },
              { label: "처리 완료", count: completedCount },
              { label: "처리 가능", count: readyCount },
            ].map(({ label, count }) => {
              const active = filter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(label)}
                  className={`text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${active
                      ? "bg-ink text-white border border-ink"
                      : "bg-white text-muted border border-chip hover:bg-hover"
                    }`}
                >
                  {label} {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table */}
        <div className="m-[16px_28px_24px] bg-white border border-line rounded-[12px] overflow-hidden shadow-2xs">
          {/* Table Header */}
          <div className="grid grid-cols-[130px_1fr_1.25fr_90px_70px_104px] gap-3 items-center px-4.5 py-3 bg-page border-b border-line2 text-[11.5px] font-semibold text-faint">
            <span>주문번호</span>
            <span>이메일</span>
            <span>상품</span>
            <span>금액</span>
            <span>시각</span>
            <span>상태</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-line3">
            {loading ? (
              <div className="py-12 text-center text-muted text-[13px]">
                불러오는 중...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-muted text-[13px]">
                해당 조건의 주문이 없습니다.
              </div>
            ) : (
              filteredOrders.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[130px_1fr_1.25fr_90px_70px_104px] gap-3 items-center px-4.5 py-3 text-[13px] hover:bg-hover/50 transition-colors"
                >
                  {/* Order ID */}
                  <span className="font-mono text-[12px] text-muted truncate">
                    {row.id}
                  </span>

                  {/* Email */}
                  <span className="truncate text-ink">{row.email}</span>

                  {/* Items */}
                  <span className="truncate text-body text-[12.5px]">
                    {row.items}
                  </span>

                  {/* Amount */}
                  <span className="font-semibold text-ink text-[13px]">
                    {row.amount}
                  </span>

                  {/* Time */}
                  <span className="font-mono text-[12.5px] text-muted">
                    {row.time}
                  </span>

                  {/* Status Pill */}
                  <div>
                    <StatusPill status={row.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}