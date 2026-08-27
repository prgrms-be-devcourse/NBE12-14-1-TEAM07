# Handoff: Grids & Circles 주문 서비스 UI (Next.js + Tailwind)

## Overview
원두 커피 온라인 주문 서비스의 UI 디자인. 회원가입 없이 이메일을 식별자로 사용한다.
화면 5개: 메인(상품 조회 + 주문 등록), 사용자 주문 내역(다건 조회/수정/삭제), 주문 수정 패널(수량 변경 + 상품 추가), 관리자 주문 관리(날짜별 조회/일괄 처리), 관리자 상품 관리(등록/수정/삭제).
비즈니스 규칙: 당일 14:00 이전 주문은 당일 발송, 이후는 익일 처리.

## About the Design Files
이 번들의 `order-service-ui.dc.html`은 **HTML로 만든 디자인 레퍼런스**다. 프로덕션 코드가 아니므로 그대로 복사하지 말 것.
과제는 이 디자인을 **Next.js(App Router) + Tailwind CSS 환경에서 재구현**하는 것. 백엔드는 이미 Spring RESTful API로 구축되어 있으므로 프론트엔드는 해당 API를 소비한다.

## Fidelity
**High-fidelity.** 색상·타이포·간격·라운딩·상태까지 확정값이다. 아래 토큰과 측정값대로 픽셀 단위로 재현할 것.

## Tech Setup (Next.js + Tailwind)

### 폰트 — Pretendard
```tsx
// app/layout.tsx
import localFont from "next/font/local";
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap", weight: "45 920", variable: "--font-pretendard",
});
// <body className={`${pretendard.variable} font-sans`}>
```
CDN 대안: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css`
모노스페이스(주문번호·시각·라벨): `ui-monospace, Menlo, monospace` — 시스템 폰트 그대로.

### tailwind.config.ts
```ts
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-pretendard)", "sans-serif"] },
      colors: {
        ink: "#17181c",        // 텍스트 기본, 버튼/액센트 (다크)
        body: "#44464e",       // 본문 보조 텍스트
        muted: "#666b75",      // 설명 텍스트, 비활성 탭
        faint: "#878c96",      // 라벨, 캡션, 메타
        disabled: "#a7acb6",   // 비활성 텍스트
        canvas: "#eceef1",     // 문서 배경
        page: "#f7f8fa",       // 페이지 배경
        hover: "#f1f2f5",      // 호버 배경
        selected: "#f5f6f8",   // 선택 행 배경
        line: "#e3e5ea",       // 카드/헤더 보더
        line2: "#edeff3",      // 구분선(divider)
        line3: "#f2f3f6",      // 테이블 행 보더
        field: "#d9dce2",      // 인풋 보더
        chip: "#dfe2e8",       // 칩 보더
        chipbg: "#eff0f3",     // 비활성 칩/버튼 배경
        ok: { bg: "oklch(0.95 0.03 150)", fg: "oklch(0.45 0.1 150)" },   // 처리 완료/판매중
        info: { bg: "oklch(0.95 0.02 250)", fg: "oklch(0.45 0.1 250)" }, // 처리 대기/가능
        warn: { bg: "oklch(0.96 0.03 75)", fg: "oklch(0.52 0.11 75)" },  // 처리 불가
        danger: { DEFAULT: "oklch(0.5 0.12 25)", hover: "oklch(0.44 0.12 25)", bg: "oklch(0.97 0.02 25)" }, // 삭제
        live: "oklch(0.75 0.13 155)", // 헤더 배지의 그린 도트
      },
    },
  },
} satisfies Config;
```
Tailwind v4를 쓰면 `@theme` 블록에 같은 값을 CSS 변수로 선언.

### 권장 라우트 구조
```
app/
  page.tsx                 # 1a 메인 (상품 그리드 + 주문서)
  orders/page.tsx          # 1b 사용자 주문 내역 (?email= 쿼리)
  admin/orders/page.tsx    # 1c 관리자 주문 관리
  admin/products/page.tsx  # 2b 관리자 상품 관리
components/
  Logo.tsx  Header.tsx  ProductCard.tsx  OrderForm.tsx
  QtyStepper.tsx  StatusPill.tsx  FilterChips.tsx
  OrderCard.tsx  OrderEditPanel.tsx  ConfirmDialog.tsx
  admin/StatCard.tsx  admin/OrderTable.tsx  admin/ProductTable.tsx  admin/ProductForm.tsx
```
인터랙션이 있는 부분(스테퍼, 탭, 필터, 폼, 다이얼로그)은 `"use client"` 컴포넌트로.

### Spring API 연동
`NEXT_PUBLIC_API_BASE` 환경변수로 베이스 URL 주입, `fetch`는 서버 컴포넌트/route handler에서 우선 수행. Spring 쪽 CORS에 Next 도메인 허용 필요.
아래는 화면 → API 매핑(**엔드포인트명은 가정이므로 실제 API 스펙에 맞춰 치환**):
- 상품 목록 (1a 그리드, 2a 추가 카탈로그, 2b 테이블): `GET /api/v1/products`
- 주문 등록 (1a 주문서): `POST /api/v1/orders` — body `{ email, address, postcode, items: [{ productId, quantity }] }`
- 내 주문 다건 조회 (1b): `GET /api/v1/orders?email=`
- 주문 수정 (1b/2a — 수량 변경·항목 삭제·상품 추가 포함): `PUT /api/v1/orders/{orderId}` — items 배열 전체 교체 방식 권장
- 주문 삭제 (1b): `DELETE /api/v1/orders/{orderId}`
- 관리자 날짜별 주문 (1c): `GET /api/v1/admin/orders?date=YYYY-MM-DD`
- 일괄 처리 (1c): `POST /api/v1/admin/orders/process` — body `{ orderIds: [] }`
- 상품 등록/수정/삭제 (2b): `POST | PUT | DELETE /api/v1/products(/{id})`
- 14:00 컷오프 판정은 서버 기준. UI는 상태값(`처리 대기/완료/가능/불가`)만 렌더.

## Design Tokens

### 타이포그래피 (Pretendard)
- 히어로: 29px / 800 / line-height 1.35 / letter-spacing -0.02em
- 페이지 제목: 22px / 800 / -0.02em · 로고: 19px / 800 / -0.02em
- 카드 제목: 16px / 700 / -0.01em · 통계 숫자: 23px / 800
- 상품명: 15px / 600 · 리스트 제목: 14.5px / 600 · 금액 강조: 18px / 800
- 본문: 13.5px, 13px / 400–600 · 보조: 12.5px, 12px
- 캡션/라벨: 11.5px, 11px (모노 라벨은 ui-monospace 11px, letter-spacing .12em는 로고 서브에만)
- 버튼: 13–14.5px / 600

### 스페이싱 & 라운딩
- 페이지 패딩: 28px 좌우, 섹션 간 18–30px, 카드 패딩 20px, 그리드 gap 16–22px
- radius: 인풋/버튼 8px, 작은 버튼 7px, 카드 11–12px, 리스트 아이템 9px, 배지/칩/pill 999px, 배지(관리자) 5px
- 보더: 카드 1px `line`, 인풋 1px `field`, 아웃라인 버튼 1.5px `ink`, 선택 카드 1.5px `ink`
- 그림자: 다이얼로그 `0 10px 28px rgba(0,0,0,.12)`, 선택 카드 `0 2px 8px rgba(23,24,28,.08)`

### 컨트롤 규격
- 인풋 높이 38–40px, padding 0 12–14px, 폰트 13px
- 주 버튼(다크): 높이 42–46px, bg `ink`, hover `#000`, 텍스트 흰색
- 아웃라인 버튼: 1.5px `ink` 보더, hover bg `hover`
- 수량 스테퍼: 26×28px 버튼 + 26px 숫자, 보더 `field`, radius 7px
- 탭/필터 칩: pill, 활성 = bg `ink` 흰 텍스트, 비활성 = 흰 bg + `chip` 보더 + `muted` 텍스트, 라벨에 건수 표기 ("전체 8")
- 상태 pill: 11.5px/600, padding 4px 9px — 처리 대기·가능 `info`, 처리 완료·판매중 `ok`, 처리 불가 `warn`, 숨김 `chipbg`+`faint`
- 체크박스: 16px, radius 4px, 체크 시 bg `ink` + 흰 ✓

### 로고
사각형 13×13px(2.5px `ink` 보더) + 원 13×13px(2.5px 보더, radius 999px, margin-left -5px, bg 흰색) 나란히 + 워드마크 "Grids & Circles".

## Screens / Views

### 1a 메인 페이지 (`/`) — 1180px 기준
- 헤더(흰 bg, 하단 1px `line`, padding 18px 28px): 좌측 로고+워드마크+모노 캡션 `COFFEE ROASTERS`, 우측 이메일 인풋(230px) + "내 정보" 아웃라인 버튼 → `/orders?email=`
- 히어로(padding 30px 28px 22px): 좌측 29px 헤드라인 2줄 + 13.5px `muted` 서브카피. 우측 다크 pill 배지 "오후 2시 이전 주문은 당일 발송" + 그린 도트(`live`, 7px)
- 본문 2단: 좌측 상품 그리드(2열, gap 16px) — 카드: 이미지 영역 126px(placeholder), 상품명 15px/600, 노트 12.5px `muted`, 가격 15px/700 + "담기" 다크 버튼(9px 18px)
- 우측 주문서 카드(330px 고정): 담긴 항목(이름+용량, 스테퍼, 금액) → 구분선 → 상품 합계/배송비(3,000원)/총 결제 금액(18px/800) → 이메일·주소·우편번호(120px) 인풋 → "주문 등록하기" 46px 다크 버튼 → 안내문 11.5px `faint` 가운데 정렬

### 1b 사용자 주문 내역 (`/orders`)
- 헤더: 로고 + 우측 아바타(26px 원, bg `ink`, 흰 이니셜) + 이메일
- 타이틀 22px "주문 내역" + 설명 13px `muted`
- 상태 탭(pill): 전체 N / 처리 대기 N / 처리 완료 N — 클릭 시 목록 필터
- 좌측 주문 카드 리스트(gap 10px): 모노 주문번호 + 상태 pill / 요약 14.5px/600 / 날짜·금액 12.5px `muted`. 선택 카드: 1.5px `ink` 보더 + 그림자 + 하단에 "수정"(아웃라인)·"삭제"(danger 아웃라인) 버튼 2개
- 우측 상세·수정 패널(400px): 메타 3줄(주문번호/일시/합계) → "수정 가능한 항목" 모노 라벨 → 이메일·주소(+우편번호 96px) 인풋 → 상품 라인(bg `page` 박스 + 스테퍼) → "수정 저장"(다크) + "취소"(아웃라인)
- 삭제 확인 다이얼로그: 제목 15px/700, 본문에 주문번호 + "삭제한 주문은 되돌릴 수 없어요", 우측 정렬 취소/삭제하기(danger bg) — 실제 구현은 모달 오버레이(중앙, dim rgba(0,0,0,.4)) 권장

### 2a 주문 수정 — 상품 추가 (1b 패널의 완성형, 440px)
- "주문 상품" 모노 라벨 아래 항목 행(bg `page`, 보더 `line2`, radius 9px): 이름+용량 / 스테퍼(수량 1 미만 불가) / 라인 금액(수량×단가) / × 제거 버튼(hover 시 danger)
- "상품 추가" 모노 라벨 아래 카탈로그 행(흰 bg, 보더 `line2`): 이름+용량 / 단가 / "+ 추가" 버튼(1.5px `ink` 아웃라인). 이미 담긴 상품은 "담김 ✓" (bg `chipbg`, `disabled` 텍스트, 클릭 불가)
- 추가 시 주문 상품 목록에 수량 1로 append, 합계·총액 즉시 재계산(배송비 3,000원 고정)
- 하단 합계 블록과 버튼은 1a 주문서와 동일 패턴

### 1c 관리자 주문 관리 (`/admin/orders`)
- 헤더: 로고 + "관리자" 배지(11px/700, bg `ink`, radius 5px) + 우측 관리자 이메일
- 툴바: 날짜 셀렉터(42px, 흰 bg + `field` 보더 + ▼) + 모노 캡션 "처리 기준 · 당일 14:00" + 우측 "선택 N건 일괄 처리" 다크 버튼
- 통계 카드 4개(균등 flex, gap 12px): 오늘 주문 / 처리 완료(`ok.fg`) / 처리 가능(`info.fg`) / 아직 처리 불가(`warn.fg`) — 숫자 23px/800
- 필터 칩: 전체/처리 완료/처리 가능/처리 불가 + 건수, 클릭 시 테이블 필터
- 테이블(카드형, radius 12px): grid `38px 128px 1fr 1.25fr 84px 64px 104px 96px` = 체크박스/주문번호(모노)/이메일/상품/금액/시각(모노)/상태 pill/액션. 액션: 처리 가능 → "처리" 다크 버튼, 완료 → "완료됨" `disabled` 텍스트, 불가 → "익일 처리" 비활성 버튼(bg `chipbg`)
- 푸터 안내: "14:00 이후 접수된 주문은 다음 영업일 오전에 처리할 수 있어요."

### 2b 관리자 상품 관리 (`/admin/products`)
- 헤더 동일 + 서브 내비 탭: "주문 관리"(비활성, `faint`) / "상품 관리"(활성, 700 + 하단 2.5px `ink` 보더)
- 툴바: "상품 관리" 22px + "전체 N개" 캡션, 우측 "+ 새 상품 등록" 다크 버튼 → 폼을 등록 모드로 초기화
- 좌측 상품 테이블: grid `52px 1.1fr 1.5fr 90px 76px 128px` = 사진(36px 썸네일)/상품명 13.5px/600/노트 12.5px `muted`/가격/상태 pill(판매중 `ok`, 숨김 `chipbg`)/우측 정렬 "수정"(아웃라인)·"삭제"(danger 텍스트 버튼). 수정 중인 행은 bg `selected`
- 우측 폼 카드(360px): 제목 "상품 수정 | 새 상품 등록"(모드에 따라) + 서브 12.5px — 상품명 / 테이스팅 노트 / 가격(200g 기준) + 판매 상태 세그먼트(판매중·숨김, 110px) / 판매 용량 칩(200g·500g·1kg, 다중 선택) / 사진 업로드 드롭존(84px, 1.5px dashed `field`) / CTA "수정 저장 | 등록하기"(다크) + 취소
- 삭제 확인 다이얼로그: "상품을 삭제할까요?" + "이미 등록된 주문에는 영향이 없어요" + 취소/삭제하기(danger)

## Interactions & Behavior
- 호버: 다크 버튼 → `#000`, 아웃라인/고스트 → bg `hover`, 삭제 계열 → bg `danger.bg`. 트랜지션 150ms ease 권장(목업엔 미포함)
- 탭·필터 칩: 클릭 시 즉시 필터, 활성 스타일 토글, 라벨의 건수는 필터 전 전체 기준
- 스테퍼: − 는 수량 1에서 비활성(주문 항목에선 1 미만 불가), 삭제는 × 버튼으로
- 상품 추가: 중복 추가 방지(담김 ✓), 추가 즉시 합계 재계산
- 삭제류는 반드시 확인 다이얼로그 경유. 확인 문구에 대상 식별자 포함
- 폼 검증: 이메일 형식, 주소 필수, 우편번호 5자리, 가격 숫자. 에러는 인풋 하단 12px danger 텍스트 권장
- 로딩/빈 상태는 목업에 없음 — 스켈레톤(카드 실루엣) + "주문이 없어요" 빈 상태 문구 추가 구현 권장

## State Management
- 메인: `cart: {productId, qty}[]`, 주문 폼 필드, 제출 상태
- 주문 내역: `activeTab`, `selectedOrderId`, 수정 draft(`editItems` — 수량 변경·삭제·추가 반영 후 PUT), 삭제 확인 대상
- 관리자 주문: `date`, `filter`, `checkedIds: Set`, 일괄 처리 진행 상태
- 관리자 상품: `formMode: "등록" | "수정"`, `selectedProduct`, 삭제 확인 대상
- 서버 상태는 fetch + revalidate(또는 SWR/TanStack Query), 수정·삭제 후 목록 재검증

## Assets
- 상품 사진: 목업은 대각선 스트라이프 placeholder(`repeating-linear-gradient(45deg, #e9ebef 0 10px, #f4f5f7 10px 20px)`). 실서비스에선 실제 원두 사진으로 교체 (`next/image`)
- 로고: CSS 도형(사각+원)이므로 별도 에셋 불필요. SVG로 추출해 파비콘 겸용 권장
- 아이콘 없음 — ▼, ×, ✓, − , + 는 텍스트 글리프

## Files
- `order-service-ui.dc.html` — 5개 화면 전체 디자인 (1a 메인 / 1b 주문 내역 / 1c 관리자 주문 / 2a 주문 수정+상품 추가 / 2b 관리자 상품 관리). 브라우저로 열면 인터랙티브하게 확인 가능
