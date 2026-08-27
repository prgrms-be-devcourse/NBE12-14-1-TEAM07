"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "삭제하기",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-line rounded-[12px] p-5 max-w-[380px] w-full shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
        <h3 className="text-[15px] font-bold text-ink">{title}</h3>
        <p className="text-[12.5px] text-muted mt-1.5 leading-[1.6]">
          {description}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-[38px] px-4 border border-field text-muted rounded-lg text-[13px] font-semibold hover:bg-hover transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[38px] px-4 bg-danger text-white rounded-lg text-[13px] font-semibold hover:bg-danger-hover transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
