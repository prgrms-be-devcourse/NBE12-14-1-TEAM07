"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import StatusPill from "@/components/StatusPill";
import QtyStepper from "@/components/QtyStepper";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchMyOrders, deleteOrder, modifyOrder, cancelOrderDetail } from "@/lib/api";
import { UserOrdersDto } from "@/lib/types";

interface OrderItem {
  detailId: number;
  productId: number;
  productName: string;
  qty: number;
  price: number;
}

interface OrderRecord {
  id: string;
  date: string;
  summary: string;
  amount: number;
  status: "처리 대기" | "처리 완료";
  items: OrderItem[];
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@test.com";

function toOrderRecord(o: UserOrdersDto): OrderRecord {
  const items: OrderItem[] = o.ordersDetails.map((d) => ({
    detailId: d.id,
    productId: d.productId,
    productName: d.productName,
    qty: d.quantity,
    price: d.quantity > 0 ? d.totalPrice / d.quantity : 0,
  }));

  const amount = o.ordersDetails.reduce((sum, d) => sum + d.totalPrice, 0);

  const summary =
    items.length === 0
      ? "주문 상품 없음"
      : items.length === 1
        ? `${items[0].productName} ×${items[0].qty}`
        : `${items[0].productName} 외 ${items.length - 1}건`;

  const allCompleted =
    o.ordersDetails.length > 0 &&
    o.ordersDetails.every((d) => d.status === "COMPLETED");

  return {
    id: String(o.id),
    date: o.modifyDate.replace("T", " ").slice(0, 16),
    summary,
    amount,
    status: allCompleted ? "처리 완료" : "처리 대기",
    items,
  };
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userEmail = searchParams.get("email") || "user@domain.com";
  const isAdmin = userEmail === ADMIN_EMAIL;

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("전체");

  const [deletedDetailIds, setDeletedDetailIds] = useState<number[]>([]);

  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      router.replace("/admin/orders");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (isAdmin) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchMyOrders(userEmail);
        const rows = data.map(toOrderRecord);
        setOrders(rows);
        if (rows.length > 0) {
          setSelectedId(rows[0].id);
          setEditItems(rows[0].items.map((it) => ({ ...it })));
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userEmail, isAdmin]);

  const selectedOrder = orders.find((o) => o.id === selectedId);

  const handleSelectOrder = (order: OrderRecord) => {
    setSelectedId(order.id);
    setEditItems(order.items.map((it) => ({ ...it })));
  };

  const filteredOrders = orders.filter((o) => {
    if (currentTab === "전체") return true;
    return o.status === currentTab;
  });

  const tabCounts = {
    전체: orders.length,
    "처리 대기": orders.filter((o) => o.status === "처리 대기").length,
    "처리 완료": orders.filter((o) => o.status === "처리 완료").length,
  };

  const editSubtotal = editItems.reduce((acc, it) => acc + it.price * it.qty, 0);

const handleSaveEdit = async () => {
  if (editItems.length === 0) {
    alert("주문 상품은 최소 1개 이상이어야 합니다.");
    return;
  }

  if (!selectedOrder) {
    return;
  }

  const orderId = Number(selectedOrder.id);

  const details = editItems.map((item) => ({
    detailId: item.detailId,
    productId: item.productId,
    quantity: item.qty,
  }));

  try {
    // 1. 상품 / 수량 수정
    await modifyOrder(orderId, details);

    // 2. X 누른 상세주문 취소
    for (const detailId of deletedDetailIds) {
      await cancelOrderDetail(orderId, detailId);
    }

    // 3. 취소할 상세주문 목록 초기화
    setDeletedDetailIds([]);

    // 4. ⭐ 수정이 끝났으니 사용자 주문 다건 조회 다시 실행
    const data = await fetchMyOrders(userEmail);
    const rows = data.map(toOrderRecord);

    // 5. 왼쪽 주문 목록 최신 데이터로 변경
    setOrders(rows);

    // 6. 방금 수정했던 주문을 다시 찾기
    const updatedOrder = rows.find(
      (order) => order.id === selectedOrder.id
    );

    // 7. 오른쪽 상세 화면도 최신 데이터로 변경
    if (updatedOrder) {
      setSelectedId(updatedOrder.id);
      setEditItems(
        updatedOrder.items.map((item) => ({ ...item }))
      );
    }

    alert("주문이 수정되었습니다.");
  } catch (error) {
    console.error(error);
    alert("주문 수정에 실패했습니다.");
  }
};

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteOrder(Number(deleteTargetId));

      // 삭제 후 다건 조회를 다시 실행해 서버 상태와 맞춤
      const data = await fetchMyOrders(userEmail);
      const rows = data.map(toOrderRecord);
      setOrders(rows);

      // 삭제한 주문이 선택 상태였다면 첫 번째 주문으로 이동
      if (selectedId === deleteTargetId) {
        if (rows.length > 0) {
          setSelectedId(rows[0].id);
          setEditItems(rows[0].items.map((it) => ({ ...it })));
        } else {
          setSelectedId("");
          setEditItems([]);
        }
      }
    } catch {
      alert("주문 삭제에 실패했습니다.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (isAdmin) return null;

  return (
    <div className="min-h-screen bg-canvas p-0 sm:p-6 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-[1180px] bg-page border border-line rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-7 py-[18px] border-b border-line bg-white">
          <Logo showSubtitle={false} />
          <div className="flex items-center gap-2 text-[12.5px] text-muted">
            <span className="w-[26px] h-[26px] rounded-full bg-ink text-white flex items-center justify-center font-bold text-[12px]">
              {userEmail.charAt(0).toUpperCase()}
            </span>
            <span>{userEmail}</span>
          </div>
        </header>

        {/* Page Title & Status Tabs */}
        <div className="px-7 pt-7 pb-2.5">
          <h1 className="font-extrabold tracking-[-0.02em] text-[22px] text-ink">
            주문 내역
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            이메일로 조회한 내 주문이에요. 주문을 클릭하면 수정하거나 삭제할 수 있어요.
          </p>

          <div className="flex gap-2 mt-4.5">
            {(["전체", "처리 대기", "처리 완료"] as const).map((tab) => {
              const active = currentTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentTab(tab)}
                  className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${active
                      ? "bg-ink text-white border border-ink"
                      : "bg-white text-muted border border-chip hover:bg-hover"
                    }`}
                >
                  {tab} {tabCounts[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="flex flex-col lg:flex-row gap-[22px] p-[18px_28px_28px] items-start">
          {/* Left Column: Orders List */}
          <div className="flex-1 w-full flex flex-col gap-2.5">
            {loading ? (
              <div className="py-16 text-center text-muted bg-white border border-line rounded-[12px]">
                불러오는 중...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-muted bg-white border border-line rounded-[12px]">
                주문 내역이 없습니다.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === selectedId;
                return (
                  <div
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`p-[14px_16px] rounded-[10px] cursor-pointer transition-all bg-white ${isSelected
                        ? "border-[1.5px] border-ink shadow-[0_2px_8px_rgba(23,24,28,0.08)]"
                        : "border border-line hover:border-faint"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11.5px] text-faint">
                        {order.id}
                      </span>
                      <StatusPill status={order.status} />
                    </div>

                    <div className="text-[14.5px] font-semibold text-ink mt-2">
                      {order.summary}
                    </div>

                    <div className="text-[12.5px] text-muted mt-1">
                      {order.amount.toLocaleString("ko-KR")}원
                    </div>

                    {isSelected && order.status !== "처리 완료" && (
                      <div className="flex mt-3.5 pt-2 border-t border-line2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(order.id);
                            setDeleteModalOpen(true);
                          }}
                          className="w-full h-9 flex items-center justify-center border-[1.5px] border-danger text-danger rounded-lg text-[13px] font-semibold hover:bg-danger-bg transition-colors cursor-pointer"
                        >
                          주문 취소
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Order Detail & Edit Panel */}
          {selectedOrder && (
            <div className="w-full lg:w-[420px] flex-none bg-white border border-line rounded-[12px] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-[-0.01em] text-[16px] text-ink">
                  주문 상세 · 수정
                </span>
                <StatusPill status={selectedOrder.status} />
              </div>

              <div className="mt-3.5 flex flex-col gap-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-faint">주문번호</span>
                  <span className="font-mono text-ink font-medium">
                    {selectedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-faint">최종 변경</span>
                  <span className="text-ink">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-faint">합계 금액</span>
                  <span className="font-bold text-ink">
                    {editSubtotal.toLocaleString("ko-KR")}원
                  </span>
                </div>
              </div>

              <div className="border-t border-line2 my-4" />

              {/* Order Items List */}
              <div className="font-mono text-[11px] text-faint mb-2">
                주문 상품
              </div>
              <div className="flex flex-col gap-2">
                {editItems.map((item, idx) => (
                  <div
                    key={item.detailId}
                    className="flex items-center gap-2.5 p-2.5 border border-line2 rounded-[9px] bg-page"
                  >
                    <div className="flex-1 min-w-0 text-[13px] font-medium text-ink truncate">
                      {item.productName}
                    </div>

                    <QtyStepper
                      quantity={item.qty}
                      min={1}
                      disabled={selectedOrder.status === "처리 완료"}
                      onIncrease={() => {
                        if (selectedOrder.status === "처리 완료") return;

                        setEditItems((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, qty: x.qty + 1 } : x
                          )
                        );
                      }}
                      onDecrease={() => {
                        if (selectedOrder.status === "처리 완료") return;

                        setEditItems((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, qty: Math.max(1, x.qty - 1) } : x
                          )
                        );
                      }}
                    />

                    <div className="w-[60px] text-right text-[13px] font-semibold text-ink">
                      {(item.price * item.qty).toLocaleString("ko-KR")}원
                    </div>

                    {selectedOrder.status !== "처리 완료" && (
                      <button 
                        type="button"
                        onClick={() => {
                          // X 누른 상세주문 ID를 기억
                          setDeletedDetailIds((prev) => [
                            ...prev,
                            item.detailId,
                          ]);

                          // 화면에서는 제거
                          setEditItems((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-faint text-[14px] hover:bg-danger-bg hover:text-danger transition-colors cursor-pointer"
                        title="항목 제거"
                      > 
                        ×
                      </button>
                      )}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              {selectedOrder.status !== "처리 완료" && (
                <div className="flex gap-2 mt-5">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="flex-1 h-[42px] flex items-center justify-center bg-ink text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-black transition-colors cursor-pointer"
                  >
                    수정 저장
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectOrder(selectedOrder)}
                    className="w-[90px] h-[42px] flex items-center justify-center border border-field text-muted rounded-[9px] text-[13.5px] font-semibold hover:bg-hover transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="주문을 삭제할까요?"
        description={`${deleteTargetId} · 삭제한 주문은 되돌릴 수 없어요.`}
        confirmText="삭제하기"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <OrdersContent />
    </Suspense>
  );
}