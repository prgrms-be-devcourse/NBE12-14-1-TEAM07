interface StatusPillProps {
  status: "처리 대기" | "처리 완료" | "처리 가능" | "처리 불가" | "판매중" | "숨김" | string;
}

export default function StatusPill({ status }: StatusPillProps) {
  let styleClasses = "bg-info-bg text-info-fg"; // default: info

  switch (status) {
    case "처리 완료":
    case "판매중":
    case "COMPLETED":
      styleClasses = "bg-ok-bg text-ok-fg";
      break;
    case "처리 불가":
      styleClasses = "bg-warn-bg text-warn-fg";
      break;
    case "숨김":
    case "CANCELED":
      styleClasses = "bg-chipbg text-faint";
      break;
    case "처리 대기":
    case "처리 가능":
    case "CREATED":
    default:
      styleClasses = "bg-info-bg text-info-fg";
      break;
  }

  const label =
    status === "CREATED"
      ? "처리 대기"
      : status === "COMPLETED"
      ? "처리 완료"
      : status === "CANCELED"
      ? "주문 취소"
      : status;

  return (
    <span
      className={`inline-block text-[11.5px] font-semibold px-[9px] py-[4px] rounded-full whitespace-nowrap leading-none ${styleClasses}`}
    >
      {label}
    </span>
  );
}
