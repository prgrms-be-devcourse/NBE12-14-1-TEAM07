"use client";

import { useState } from "react";
import { CartItem } from "@/lib/types";
import QtyStepper from "./QtyStepper";

interface OrderFormProps {
  cart: CartItem[];
  onUpdateQty: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
}

export default function OrderForm({
  cart,
  onUpdateQty,
  onRemoveItem,
}: OrderFormProps) {
  const [email, setEmail] = useState("yunchan@naver.com");
  const [address, setAddress] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("주문할 상품을 1개 이상 담아주세요.");
      return;
    }
    setIsOrdered(true);
  };

  return (
    <div className="w-[330px] flex-none bg-white border border-line rounded-[12px] p-5 shadow-xs">
      <div className="font-bold tracking-[-0.01em] text-[16px] text-ink">
        주문서
      </div>

      {/* 장바구니 아이템 목록 */}
      <div className="mt-3.5 flex flex-col gap-3">
        {cart.length === 0 ? (
          <div className="py-6 text-center text-muted text-[13px]">
            장바구니가 비어 있습니다.
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="flex items-center gap-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-ink truncate">
                  {item.name}
                </div>
              </div>

              <QtyStepper
                quantity={item.quantity}
                min={0}
                onIncrease={() => onUpdateQty(item.productId, item.quantity + 1)}
                onDecrease={() => {
                  if (item.quantity > 1) {
                    onUpdateQty(item.productId, item.quantity - 1);
                  } else {
                    onRemoveItem(item.productId);
                  }
                }}
              />

              <div className="w-[62px] text-right text-[13.5px] font-semibold text-ink">
                {(item.price * item.quantity).toLocaleString("ko-KR")}원
              </div>
            </div>
          ))
        )}
      </div>

      {/* 금액 요약 */}
      <div className="border-t border-line2 my-4" />
      <div className="flex justify-between items-baseline">
        <span className="text-[13px] font-semibold text-ink">총 결제 금액</span>
        <span className="text-[18px] font-extrabold tracking-[-0.01em] text-ink">
          {total.toLocaleString("ko-KR")}원
        </span>
      </div>

      {/* 배송 정보 폼 */}
      <div className="border-t border-line2 my-4" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div>
          <div className="text-[12px] font-semibold text-muted mb-1">이메일</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 border border-field rounded-lg text-[13px] text-ink bg-white focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <div className="text-[12px] font-semibold text-muted mb-1">주소</div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="배송 받을 주소"
            className="w-full h-10 px-3 border border-field rounded-lg text-[13px] text-ink bg-white placeholder:text-faint focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <button
          type="submit"
          className="mt-4 h-[46px] w-full flex items-center justify-center bg-ink text-white text-[14.5px] font-semibold rounded-[9px] hover:bg-black active:scale-[0.99] transition-all cursor-pointer"
        >
          주문 등록하기
        </button>

        {/* 당일 발송 안내 배지 */}
        <div className="mt-3 p-2.5 rounded-[9px] bg-page border border-line2 flex items-center justify-center gap-1.5 text-[11.5px] text-muted text-center leading-snug">
          <span className="w-1.5 h-1.5 rounded-full bg-live shrink-0 animate-pulse" />
          <span>
            당일 <strong className="font-semibold text-ink">오후 2시 이후</strong>의 주문 건은{" "}
            <strong className="font-semibold text-ink">다음 날 배송</strong>이 시작됩니다.
          </span>
        </div>
      </form>

      {/* 주문 완료 확인 모달 (UI 인터랙션) */}
      {isOrdered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-line rounded-[12px] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-ok-bg text-ok-fg flex items-center justify-center font-bold text-lg mb-3">
              ✓
            </div>
            <h3 className="text-[17px] font-bold text-ink">
              주문이 접수되었습니다!
            </h3>
            <p className="text-[13px] text-muted mt-2 leading-relaxed">
              주문번호:{" "}
              <span className="font-mono font-semibold text-ink">
                GC-2608-0391
              </span>
              <br />
              등록하신 이메일(<span className="text-ink font-medium">{email}</span>)로 내 주문 내역을 조회할 수 있습니다.
            </p>

            {/* 모달 내 배송 안내 박스 */}
            <div className="mt-3.5 p-3 rounded-lg bg-page border border-line2 flex items-start gap-2 text-[12px] text-muted leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-live mt-1.5 shrink-0" />
              <span>
                당일 <strong className="font-semibold text-ink">오후 2시 이후</strong>의 주문 건은{" "}
                <strong className="font-semibold text-ink">다음 날 배송이 시작</strong>됩니다.
              </span>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsOrdered(false)}
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
