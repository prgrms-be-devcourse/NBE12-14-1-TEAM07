# Grids & Circles

이메일을 사용자 식별자로 사용하는 원두 주문 서비스입니다.

사용자는 원두 상품을 주문하고 주문 내역을 조회·수정·취소할 수 있습니다. 관리자는 배송일별 주문을 조회하고 처리 완료 상태로 변경할 수 있습니다.

## 주요 기능

- 원두 상품 조회 및 주문 등록
- 이메일 기반 주문 내역 조회
- 주문 수량 수정 및 상품별 취소
- 전체 주문 취소
- 관리자 배송일별 주문 조회
- 관리자 주문 일괄 처리

## 프로젝트 구조

~~~text
NBE12-14-1-TEAM07/
├── back/       # Spring Boot REST API
├── front/      # Next.js frontend
├── postman/    # API 테스트 자료
└── README.md
~~~

Backend와 frontend의 자세한 설명은 각 문서를 참고합니다.

- [Backend README](./back/README.md)
- [Frontend README](./front/README.md)

## 실행 환경

- Java 25
- Node.js와 npm
- Backend port: `8080`
- Frontend port: `3000`

## 실행 방법

### 1. Backend 실행

Windows PowerShell:

~~~powershell
cd back
./gradlew.bat bootRun
~~~

macOS/Linux:

~~~bash
cd back
./gradlew bootRun
~~~

Backend가 실행되면 다음 링크에서 API 문서를 확인할 수 있습니다.

- [SpringDoc Swagger-UI](http://localhost:8080/swagger-ui/index.html)

신규 DB에는 상품이 없을 수 있습니다. 이 경우 Swagger UI의 `POST /api/products`를 이용해 상품을 먼저 등록합니다.

### 2. Frontend 환경변수 설정

`front/.env.local` 파일을 생성합니다.

~~~env
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_ADMIN_EMAIL=admin@test.com
~~~

### 3. Frontend 실행

새 terminal에서 실행합니다.

~~~bash
cd front
npm install
npm run dev
~~~

브라우저에서 다음 주소로 접속합니다.

~~~text
http://localhost:3000
~~~

## 주요 화면

| 경로 | 설명 |
| --- | --- |
| `/` | 상품 조회 및 주문 등록 |
| `/orders?email={email}` | 사용자 주문 관리 |
| `/admin/orders` | 관리자 주문 관리 |
| `/admin/products` | 관리자 상품 관리 |
