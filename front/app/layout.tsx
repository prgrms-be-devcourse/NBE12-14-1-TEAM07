import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grids & Circles — 커피 로스터스 원두 주문",
  description: "오늘 볶은 원두를, 내일 아침 문 앞에. 소량 로스팅한 싱글 오리진 원두 온라인 주문 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

