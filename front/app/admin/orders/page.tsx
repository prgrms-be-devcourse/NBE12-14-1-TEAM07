"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import StatusPill from "@/components/StatusPill";
import { fetchOrders, completeOrders } from "@/lib/api";
import { OrdersDto, OrderDetailStatus } from "@/lib/types";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@test.com";

interface AdminOrderItem {
  detailId: number;
  productId: number;
  productName: string;
  qty: number;
  price: number;
  totalPrice: number;
  status: OrderDetailStatus;
}

interface AdminOrderRow {
  id: string;
  email: string;
  items: string;
  amount: string;
  time: string;
  createDate: string;
  status: "처리 가능" | "수정됨" | "처리 완료" | "취소됨";
  details: AdminOrderItem[];
}

function toAdminOrderRow(o: OrdersDto): AdminOrderRow {
  const isCanceled =
    o.orderStatus === "CANCELED" ||
    (o.ordersDetails.length > 0 &&
      o.ordersDetails.every((d) => d.status === "CANCELED"));

  const details: AdminOrderItem[] = o.ordersDetails.map((d) => ({
    detailId: d.id,
    productId: d.productId,
    productName: d.productName,
    qty: d.quantity,
    price: d.quantity > 0 ? d.totalPrice / d.quantity : 0,
    totalPrice: d.totalPrice,
    status: d.status,
  }));

  // orderStatus가 "CANCELED"인 경우 status가 "CANCELED"인 상세 품목만 반영
  // 그 외 정상/수정/완료 주문인 경우 유효한 활성 상세 품목만 반영
  const targetDetails = isCanceled
    ? o.ordersDetails.filter((d) => d.status === "CANCELED")
    : o.ordersDetails.filter(
        (d) => d.status !== "CANCELED" && d.status !== "DETAIL_CANCELED"
      );

  const total = targetDetails.reduce((sum, d) => sum + d.totalPrice, 0);

  const status: AdminOrderRow["status"] = isCanceled
    ? "취소됨"
    : o.orderStatus === "COMPLETED"
      ? "처리 완료"
      : o.orderStatus === "MODIFIED"
        ? "수정됨"
        : "처리 가능";

  return {
    id: String(o.id),
    email: o.email,
    items: `상품 ${targetDetails.length}건`,
    amount: `${total.toLocaleString("ko-KR")}원`,
    time: o.createDate.split("T")[1]?.slice(0, 5) || "",
    createDate: o.createDate,
    status,
    details,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processResult, setProcessResult] = useState<
    { type: "success"; count: number } | { type: "error" } | { type: "empty" } | null
  >(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const loadOrders = async () => {
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

  useEffect(() => {
    loadOrders();
  }, [deliveryDate]);

  // Filter calculations
  const totalCount = orders.length;
  const completedCount = orders.filter((r) => r.status === "처리 완료").length;
  const readyCount = orders.filter((r) => r.status === "처리 가능").length;
  const modifiedCount = orders.filter((r) => r.status === "수정됨").length;
  const canceledCount = orders.filter((r) => r.status === "취소됨").length;

  const sortedOrders = [...orders].sort((a, b) => {
    const dateDiff = new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
    const timeOrdered = dateOrder === "desc" ? -dateDiff : dateDiff;

    if (activeSort === "status") {
      const rank = (s: AdminOrderRow["status"]) => {
        if (statusOrder === "ready-first") {
          if (s === "처리 가능") return 0;
          if (s === "수정됨") return 1;
          if (s === "처리 완료") return 2;
          return 3; // 취소됨
        }

        if (s === "처리 완료") return 0;
        if (s === "처리 가능") return 1;
        if (s === "수정됨") return 2;
        return 3; // 취소됨
      };

      const statusDiff = rank(a.status) - rank(b.status);
      return statusDiff !== 0 ? statusDiff : timeOrdered;
    }

    return timeOrdered;
  });

  const filteredOrders = sortedOrders.filter((r) => {
    if (filter === "전체") return true;

    if (filter === "처리 가능") {
      return r.status === "처리 가능" || r.status === "수정됨";
    }

    return r.status === filter;
  });

  // Batch process all ready orders for the selected delivery date
  const handleBatchProcess = async () => {
    if (readyCount + modifiedCount === 0) {
      setProcessResult({ type: "empty" });
      return;
    }
    try {
      const count = await completeOrders(ADMIN_EMAIL, deliveryDate);
      setProcessResult({ type: "success", count });
      await loadOrders();
    } catch {
      setProcessResult({ type: "error" });
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
                if (activeSort !== "date") {
                  setActiveSort("date");
                } else {
                  setDateOrder((prev) => (prev === "desc" ? "asc" : "desc"));
                }
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
              onClick={loadOrders}
              disabled={loading}
              title="주문 목록 새로고침"
              className="h-[42px] px-3.5 bg-white border border-field rounded-[9px] text-[13px] font-semibold text-ink hover:bg-hover active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className={`text-[15px] leading-none ${loading ? "animate-spin" : ""}`}>↻</span>
            </button>
            <button
              type="button"
              onClick={handleBatchProcess}
              className="h-[42px] px-5 bg-ink text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-black active:scale-[0.99] transition-all cursor-pointer"
            >
              일괄 처리
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4.5">
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">주문 건수</div>
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
                {readyCount + modifiedCount}건
              </div>
            </div>
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">취소 건수</div>
              <div className="text-[23px] font-extrabold tracking-[-0.01em] text-danger mt-1">
                {canceledCount}건
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4.5">
            {[
              { label: "전체", count: totalCount },
              { label: "처리 완료", count: completedCount },
              { label: "처리 가능", count: readyCount + modifiedCount },
              { label: "수정됨", count: modifiedCount },
              { label: "취소됨", count: canceledCount },
            ].map(({ label, count }) => {
              const active = filter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(label)}
                  className={`text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    active
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
          <div className="grid grid-cols-[130px_1fr_1.25fr_90px_70px_104px_28px] gap-3 items-center px-4.5 py-3 bg-page border-b border-line2 text-[11.5px] font-semibold text-faint">
            <span>주문번호</span>
            <span>이메일</span>
            <span>상품</span>
            <span>금액</span>
            <span>시각</span>
            <span>상태</span>
            <span></span>
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
              filteredOrders.map((row) => {
                const isExpanded = expandedId === row.id;
                return (
                  <div key={row.id} className="flex flex-col">
                    {/* Main Row */}
                    <div
                      onClick={() => toggleExpand(row.id)}
                      className={`grid grid-cols-[130px_1fr_1.25fr_90px_70px_104px_28px] gap-3 items-center px-4.5 py-3 text-[13px] transition-colors cursor-pointer select-none ${
                        isExpanded ? "bg-selected/70 font-medium" : "hover:bg-hover/50 bg-white"
                      }`}
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

                      {/* Expand Chevron Icon */}
                      <div className="flex justify-end text-faint text-[11px]">
                        {isExpanded ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Expanded Order Details Panel */}
                    {isExpanded && (
                      <div className="bg-page/70 px-6 py-4 border-t border-b border-line2 animate-in fade-in duration-150">
                        <div className="bg-white border border-line rounded-[10px] p-4 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-line2 pb-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-ink">상세 주문 내역</span>
                              <span className="text-[11.5px] font-mono text-faint">
                                (주문번호 #{row.id})
                              </span>
                            </div>
                            <span className="text-[12px] text-muted font-medium">
                              총 {row.details.length}개 항목
                            </span>
                          </div>

                          {/* Details List */}
                          <div className="flex flex-col gap-2">
                            {row.details.map((item) => (
                              <div
                                key={item.detailId}
                                className="flex items-center justify-between p-2.5 border border-line2 rounded-[8px] bg-page/50 text-[12.5px]"
                              >
                                <div className="flex-1 min-w-0 pr-3">
                                  <div className="font-semibold text-ink truncate">
                                    {item.productName}
                                  </div>
                                {item.status === "DETAIL_CANCELED" && (
                                  <div className="text-[11px] text-danger font-semibold mt-0.5">
                                    주문 취소
                                  </div>
                                )}

                                {item.status === "MODIFIED" && (
                                  <div className="text-[11px] text-warn-fg font-semibold mt-0.5">
                                    수정됨
                                  </div>
                                )}
                                </div>

                                <div className="flex items-center gap-4 shrink-0 text-right">
                                  <span className="text-muted text-[12px]">
                                    {item.qty}개
                                  </span>
                                  <span className="text-faint text-[12px]">
                                    (개당 {item.price.toLocaleString("ko-KR")}원)
                                  </span>
                                  <span className="w-[80px] font-bold text-ink text-[13px]">
                                    {item.totalPrice.toLocaleString("ko-KR")}원
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Subtotal Summary */}
                          <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-line2 text-[12.5px]">
                            <span className="text-faint font-medium">
                              {row.status === "취소됨" ? "취소된 주문 금액" : "합계 금액"}
                            </span>
                            <span className="text-[14.5px] font-extrabold text-ink">
                              {row.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 일괄 처리 결과 모달 */}
      {processResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-line rounded-[12px] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            {processResult.type === "success" ? (
              <>
                <div className="w-10 h-10 rounded-full bg-ok-bg text-ok-fg flex items-center justify-center font-bold text-lg mb-3">
                  ✓
                </div>
                <h3 className="text-[17px] font-bold text-ink">
                  주문 처리가 완료되었습니다!
                </h3>
                <p className="text-[13px] text-muted mt-2 leading-relaxed">
                  {deliveryDate} 배송 건 중 처리 가능했던{" "}
                  <span className="font-semibold text-ink">{processResult.count}건</span>의
                  주문이 일괄 처리되었습니다.
                </p>
              </>
            ) : processResult.type === "empty" ? (
              <>
                <div className="w-10 h-10 rounded-full bg-info-bg text-info-fg flex items-center justify-center font-bold text-lg mb-3">
                  i
                </div>
                <h3 className="text-[17px] font-bold text-ink">
                  처리할 주문이 없습니다
                </h3>
                <p className="text-[13px] text-muted mt-2 leading-relaxed">
                  {deliveryDate} 배송 건 중 현재 처리 가능한 주문이 없어요.
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-warn-bg text-warn-fg flex items-center justify-center font-bold text-lg mb-3">
                  !
                </div>
                <h3 className="text-[17px] font-bold text-ink">
                  일괄 처리에 실패했습니다
                </h3>
                <p className="text-[13px] text-muted mt-2 leading-relaxed">
                  잠시 후 다시 시도해주세요.
                </p>
              </>
            )}

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setProcessResult(null)}
                className="w-full h-10 bg-ink text-white rounded-lg text-[13px] font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}