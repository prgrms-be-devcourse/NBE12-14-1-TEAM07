"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

interface HeaderProps {
  initialEmail?: string;
}

export default function Header({ initialEmail = "" }: HeaderProps) {
  const [email, setEmail] = useState(initialEmail);
  const router = useRouter();

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      alert("조회할 이메일 주소를 입력해주세요.");
      return;
    }
    router.push(`/orders?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="flex items-center justify-between px-7 py-[18px] border-b border-line bg-white">
      <Logo showSubtitle={true} />
      
      <form onSubmit={handleLookup} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          className="w-[230px] h-10 px-3.5 border border-field rounded-lg text-[13px] font-sans bg-page text-ink placeholder:text-faint focus:outline-none focus:border-ink transition-colors"
        />
        <button
          type="submit"
          className="h-10 px-[18px] border-[1.5px] border-ink text-ink rounded-lg text-[13px] font-semibold hover:bg-hover transition-colors cursor-pointer"
        >
          내 정보
        </button>
      </form>
    </header>
  );
}
