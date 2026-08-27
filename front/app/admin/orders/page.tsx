"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import StatusPill from "@/components/StatusPill";

const API_BASE = "http://localhost:8080";
const ADMIN_EMAIL = "admin@test.com";

type OrderStatus = "ORDERED" | "COMPLETED";
type OrderDetailStatus = "ORDERED" | "CANCELED" | "COMPLETED";

interface OrdersDetailDto {
  id: number;
  ordersId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: OrderDetailStatus;
}

interface OrdersDto {
  id: number;
  createDate: string;
  modifyDate: string;
  email: string;
  orderStatus: OrderStatus;
  ordersDetails: OrdersDetailDto[];
}

interface ProductDto {
  id: number;
  name: string;
  price: number;
}

interface RsData<T> {
  resultCode: string;
  msg: string;
  data: T;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(dateStr: string): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const d = new Date(`${dateStr}T00:00:00`);
  return `${dateStr} (${days[d.getDay()]})`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function formatItems(details: OrdersDetailDto[], productMap: Map<number, string>): string {
  const active = details.filter((d) => d.status !== "CANCELED");
  if (active.length === 0) return "-";
  const first = productMap.get(active[0].productId) ?? `상품 #${active[0].productId}`;
  if (active.length === 1) {
    return `${first} ×${active[0].quantity}`;
  }
  return `${first} 외 ${active.length - 1}건`;
}

function formatAmount(details: OrdersDetailDto[]): string {
  const total = details
    .filter((d) => d.status !== "CANCELED")
    .reduce((sum, d) => sum + d.totalPrice, 0);
  return `${total.toLocaleString()}원`;
}

function toStatusLabel(status: OrderStatus): "처리 가능" | "처리 완료" {
  return status === "COMPLETED" ? "처리 완료" : "처리 가능";
}

export default function AdminOrdersPage() {
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
  const [orders, setOrders] = useState<OrdersDto[]>([]);
  const [productMap, setProductMap] = useState<Map<number, string>>(new Map());
  const [filter, setFilter] = useState<string>("전체");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((products: ProductDto[]) => {
        setProductMap(new Map(products.map((p) => [p.id, p.name])));
      })
      .catch(() => {});
  }, []);

  const fetchOrders = (date: string) => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/orders?email=${encodeURIComponent(ADMIN_EMAIL)}&deliveryDate=${date}`)
      .then((res) => res.json())
      .then((res: RsData<OrdersDto[]>) => {
        setOrders(res.data);
      })
      .catch(() => {
        setError("주문 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const rows = orders.map((o) => ({
    id: o.id,
    email: o.email,
    items: formatItems(o.ordersDetails, productMap),
    amount: formatAmount(o.ordersDetails),
    time: formatTime(o.createDate),
    status: toStatusLabel(o.orderStatus),
  }));

  const totalCount = rows.length;
  const completedCount = rows.filter((r) => r.status === "처리 완료").length;
  const readyCount = rows.filter((r) => r.status === "처리 가능").length;
  const blockedCount = 0;

  const filteredRows = rows.filter((r) => {
    if (filter === "전체") return true;
    return r.status === filter;
  });

  const handleBatchProcess = () => {
    if (readyCount === 0) {
      alert("현재 처리 가능한 주문이 없습니다.");
      return;
    }
    fetch(
      `${API_BASE}/api/orders/${selectedDate}/complete?email=${encodeURIComponent(ADMIN_EMAIL)}`,
      { method: "POST" }
    )
      .then((res) => res.json())
      .then((res: RsData<number>) => {
        alert(`처리 가능한 ${res.data}건의 주문이 일괄 처리 완료되었습니다.`);
        fetchOrders(selectedDate);
      })
      .catch(() => {
        alert("일괄 처리에 실패했습니다.");
      });
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
            <label className="flex items-center gap-2.5 h-[42px] px-4 bg-white border border-field rounded-[9px] text-[14px] font-semibold text-ink shadow-2xs cursor-pointer relative">
              {formatDateLabel(selectedDate)}
              <span className="text-[10px] text-faint">▼</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <div className="font-mono text-[11.5px] text-faint">
              처리 기준 · 당일 14:00
            </div>
            <div className="hidden sm:block flex-1" />
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
              <div className="text-[12px] text-faint font-medium">오늘 주문</div>
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
            <div className="bg-white border border-line rounded-[11px] p-[14px_16px]">
              <div className="text-[12px] text-faint font-medium">아직 처리 불가</div>
              <div className="text-[23px] font-extrabold tracking-[-0.01em] text-warn-fg mt-1">
                {blockedCount}건
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4.5">
            {[
              { label: "전체", count: totalCount },
              { label: "처리 완료", count: completedCount },
              { label: "처리 가능", count: readyCount },
              { label: "처리 불가", count: blockedCount },
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
          <div className="grid grid-cols-[90px_1fr_1.25fr_90px_70px_104px] gap-3 items-center px-4.5 py-3 bg-page border-b border-line2 text-[11.5px] font-semibold text-faint">
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
            ) : error ? (
              <div className="py-12 text-center text-warn-fg text-[13px]">
                {error}
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="py-12 text-center text-muted text-[13px]">
                해당 조건의 주문이 없습니다.
              </div>
            ) : (
              filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[90px_1fr_1.25fr_90px_70px_104px] gap-3 items-center px-4.5 py-3 text-[13px] hover:bg-hover/50 transition-colors"
                >
                  {/* Order ID */}
                  <span className="font-mono text-[12px] text-muted truncate">
                    #{row.id}
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

          {/* Footer Notice */}
          <div className="p-[12px_18px] text-[12px] text-faint bg-white border-t border-line3">
            14:00 이후 접수된 주문은 다음 영업일 오전에 처리할 수 있어요.
          </div>
        </div>
      </div>
    </div>
  );
}
