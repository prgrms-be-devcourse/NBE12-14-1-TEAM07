# Frontend

Grids & Circles의 사용자 주문 화면과 관리자 화면을 제공하는 Next.js frontend입니다.

## 기술 스택

- Next.js 16.3.2
- React 19.2.8
- TypeScript
- Tailwind CSS 4
- ESLint 9
- Pretendard Web Font

## 디렉터리 구조

~~~text
front/
├── app/
│   ├── page.tsx
│   ├── orders/
│   └── admin/
│       ├── orders/
│       └── products/
├── components/
├── lib/
│   ├── api.ts
│   └── types.ts
└── public/
~~~

## 환경변수

`front/.env.local`에 작성합니다.

~~~env
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_ADMIN_EMAIL=admin@test.com
~~~

- `NEXT_PUBLIC_API_BASE`: Backend API 주소
- `NEXT_PUBLIC_ADMIN_EMAIL`: 관리자 화면에서 사용하는 이메일

관리자 이메일은 backend `application.yaml`의 `admin.email`과 같은 값으로 설정해야 합니다.

## 화면 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 상품 목록, 장바구니, 주문 등록 |
| `/orders?email={email}` | 사용자 주문 조회·수정·취소 |
| `/admin` | 관리자 주문 화면으로 redirect |
| `/admin/orders` | 배송일별 주문 조회 및 일괄 처리 |
| `/admin/products` | 관리자 상품 관리 화면 |

## 사용자 화면

메인 화면에서는 backend에서 상품 목록을 불러오고 장바구니에 상품을 추가할 수 있습니다.

주문 등록 시 다음 항목을 검사합니다.

- 장바구니에 상품이 존재하는지
- 이메일이 입력됐는지
- 이메일 형식이 올바른지
- 주소가 입력됐는지

Backend로 전송되는 주문 데이터는 다음과 같습니다.

~~~json
{
  "email": "user@example.com",
  "ordersDetails": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
~~~

사용자 주문 화면에서는 다음 기능을 제공합니다.

- 이메일별 주문 조회
- 주문 상태별 필터
- 최근 수정일 기준 정렬
- 주문 수량 및 상품 변경
- 주문 상세 상품 취소
- 전체 주문 취소

## 관리자 화면

관리자 주문 화면에서는 다음 기능을 제공합니다.

- 배송일 선택
- 주문 목록 새로고침
- 주문 상태별 필터
- 날짜·상태 기준 정렬
- 처리 가능한 주문 일괄 완료
- 주문별 상세 내역 확인

관리자 상품 화면에서는 backend 상품 목록을 조회합니다.

현재 상품 등록·수정·삭제는 frontend local state만 변경하며 backend API에는 반영되지 않습니다.

## API 연결

API 호출은 `lib/api.ts`에서 관리합니다.

| 함수 | Backend API |
| --- | --- |
| `fetchProducts` | `GET /api/products` |
| `createOrder` | `POST /api/orders` |
| `fetchMyOrders` | `GET /api/orders/me` |
| `fetchOrders` | `GET /api/orders` |
| `modifyOrder` | `PATCH /api/orders/{id}` |
| `cancelOrderDetail` | `DELETE /api/orders/{orderId}/details/{detailId}` |
| `deleteOrder` | `DELETE /api/orders/{id}` |
| `completeOrders` | `POST /api/orders/{date}/complete` |

## UI 컴포넌트 규격

공통 색상과 font token은 `app/globals.css`의 `@theme`에서 관리합니다. README와 실제 구현이 다를 경우 `globals.css`와 각 component 코드를 기준으로 합니다.

### 공통 스타일

- 기본 font는 `Pretendard`, 주문번호·시각·보조 label은 system monospace font를 사용합니다.
- 전체 화면 배경은 `canvas`, 내부 page 영역은 `page`, card 배경은 흰색을 사용합니다.
- 주요 content container의 최대 너비는 `1180px`입니다.
- 기본 card는 `line` border와 `12px` radius를 사용합니다.
- 기본 input 높이는 `40px`, font 크기는 `13px`, radius는 `8px`입니다.
- 주요 button은 `ink` 배경과 흰색 text를 사용하고 hover 시 검은색으로 변경합니다.
- 보조 button은 `ink` 또는 `field` border를 사용하고 hover 시 `hover` 배경을 적용합니다.

주요 color token:

| Token | 값 | 용도 |
| --- | --- | --- |
| `ink` | `#17181c` | 기본 text, 주요 button |
| `canvas` | `#eceef1` | 전체 화면 배경 |
| `page` | `#f7f8fa` | page 내부 배경 |
| `line` | `#e3e5ea` | card와 header border |
| `field` | `#d9dce2` | input과 control border |
| `info` | blue 계열 | 처리 대기·처리 가능 |
| `ok` | green 계열 | 처리 완료·판매중 |
| `warn` | yellow 계열 | 수정됨·처리 불가 |
| `danger` | red 계열 | 취소·삭제 |

### 공통 컴포넌트

| 컴포넌트 | 규격 |
| --- | --- |
| `Logo` | 13×13px 사각형과 원형 symbol, 19px wordmark, 선택적으로 subtitle 또는 관리자 badge 표시 |
| `Header` | 좌우 padding 28px, 상하 padding 18px, 이메일 input 230×40px |
| `ProductCard` | 12px radius, 상품 image 영역 높이 130px, 상품명·가격 15px, `담기` button 제공 |
| `QtyStepper` | 감소·수량·증가 영역 각각 너비 26px, button 높이 28px, 전체 radius 7px |
| `StatusPill` | 11.5px semibold text, 좌우 padding 9px, 상하 padding 4px, 상태별 color token 적용 |
| `ConfirmDialog` | 최대 너비 380px, padding 20px, radius 12px, 취소·확인 button 높이 38px |

상품 image를 불러오지 못하면 `bg-product-stripe` pattern과 상품명을 fallback으로 표시합니다.

## 상태 표시

| Backend 상태 | 화면 표시 |
| --- | --- |
| `ORDERED` | 처리 대기 |
| `MODIFIED` | 수정됨 |
| `COMPLETED` | 처리 완료 |
| `CANCELED` | 주문 취소 |
| `DETAIL_CANCELED` | 상세 상품 취소 |

## 개발 명령어

개발 서버:

~~~bash
npm run dev
~~~

Lint:

~~~bash
npm run lint
~~~

Production build:

~~~bash
npm run build
~~~

Production server:

~~~bash
npm run start
~~~

## 현재 제한사항

- 관리자 상품 등록·수정·삭제는 backend API와 연결되어 있지 않습니다.
- 주문서에서 입력한 주소는 backend 요청에 포함되지 않습니다.
- `createOrder`와 `modifyOrder`는 backend 주소를 `http://localhost:8080`으로 직접 사용합니다.
- 나머지 API만 `NEXT_PUBLIC_API_BASE`를 사용합니다.
- 회원 인증 없이 URL query의 이메일로 주문을 조회합니다.
- 별도의 관리자 인증 없이 설정된 관리자 이메일을 비교합니다.
