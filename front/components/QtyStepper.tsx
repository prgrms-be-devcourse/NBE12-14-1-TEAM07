"use client";

interface QtyStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  disabled?: boolean;
}

export default function QtyStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  disabled = false,
}: QtyStepperProps) {
  return (
    <div className="inline-flex items-center border border-field rounded-[7px] overflow-hidden bg-white select-none">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        className="w-[26px] h-[28px] flex items-center justify-center text-[14px] text-muted hover:bg-hover disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label="수량 감소"
      >
        −
      </button>
      <div className="w-[26px] text-center text-[13px] font-semibold text-ink">
        {quantity}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="w-[26px] h-[28px] flex items-center justify-center text-[14px] text-muted hover:bg-hover transition-colors cursor-pointer"
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  );
}
