# Backend

Grids & Circles의 상품·사용자·주문 데이터를 관리하는 Spring Boot REST API입니다.

## 기술 스택

- Java 25
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA
- Spring Validation
- H2 Database
- Springdoc OpenAPI
- Gradle Kotlin DSL

## 디렉터리 구조

~~~text
src/
├── main/
│   ├── java/com/back/nbe12141team07/
│   │   ├── domain/
│   │   │   ├── orders/
│   │   │   ├── product/
│   │   │   ├── users/
│   │   │   └── home/
│   │   └── global/
│   │       ├── exception/
│   │       ├── jpa/
│   │       └── springDoc/
│   └── resources/
│       ├── application.yaml
│       ├── application-dev.yaml
│       └── application-test.yaml
└── test/
~~~

각 domain은 다음 구조를 사용합니다.

~~~text
controller → service → repository → entity
~~~

## Profile과 Database

기본 profile은 `dev`입니다.

`application-dev.yaml`은 file 방식 H2 DB를 사용하며 다음 파일이 생성됩니다.

~~~text
back/db_dev.mv.db
~~~

`application-test.yaml`은 테스트마다 in-memory H2 DB를 사용합니다.

## 관리자 이메일 설정

관리자 주문 조회와 일괄 처리 API는 요청으로 전달된 이메일이 설정된 관리자 이메일과 같은지 검사합니다.

기본 설정은 `src/main/resources/application.yaml`에 있습니다.

~~~yaml
admin:
  email: ${ADMIN_EMAIL:admin@test.com}
~~~

관리자 이메일은 다음 순서로 결정됩니다.

1. `ADMIN_EMAIL` 환경변수가 있으면 해당 값을 사용합니다.
2. 환경변수가 없으면 기본값인 `admin@test.com`을 사용합니다.

### application.yaml에서 직접 설정

환경변수를 사용하지 않고 관리자 이메일을 고정하려면 다음과 같이 작성합니다.

~~~yaml
admin:
  email: admin@example.com
~~~

이 방식은 설정값이 Git에 포함되므로 개인 이메일이나 민감한 값은 직접 입력하지 않는 것이 좋습니다.

### 환경변수로 설정

기존 `application.yaml`을 유지하면서 실행 환경별로 관리자 이메일을 지정할 수 있습니다.

Windows PowerShell:

~~~powershell
$env:ADMIN_EMAIL = "admin@example.com"
./gradlew.bat bootRun
~~~

macOS/Linux:

~~~bash
export ADMIN_EMAIL=admin@example.com
./gradlew bootRun
~~~

IntelliJ IDEA에서는 Run Configuration의 `Environment variables`에 다음 값을 추가합니다.

~~~text
ADMIN_EMAIL=admin@example.com
~~~

Frontend에서도 같은 이메일을 `front/.env.local`에 설정해야 합니다.

~~~env
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
~~~

두 값이 다르면 관리자 주문 조회와 일괄 처리 요청이 `403 Forbidden`으로 실패합니다.

## API 문서

Backend 실행 후 다음 링크에서 API를 확인할 수 있습니다.

- [SpringDoc Swagger-UI](http://localhost:8080/swagger-ui/index.html)

Swagger API group은 `api-all`, `orders`, `products`로 구분되어 있습니다.

## Product API

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `POST` | `/api/products` | 상품 등록 |
| `GET` | `/api/products` | 상품 전체 조회 |
| `GET` | `/api/products/{id}` | 상품 단건 조회 |
| `PATCH` | `/api/products/{id}` | 상품 수정 |
| `DELETE` | `/api/products/{id}` | 상품 삭제 |

상품 등록 요청:

~~~json
{
  "name": "케냐 AA",
  "price": 17000
}
~~~

상품 수정 요청:

~~~json
{
  "name": "케냐 AA Plus",
  "price": 18000
}
~~~

상품명은 중복될 수 없습니다.

## Orders API

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `POST` | `/api/orders` | 주문 등록 |
| `GET` | `/api/orders/{id}` | 주문 단건 조회 |
| `GET` | `/api/orders/me` | 사용자 주문 목록 조회 |
| `GET` | `/api/orders` | 관리자 주문 목록 조회 |
| `PATCH` | `/api/orders/{id}` | 주문 수정 |
| `DELETE` | `/api/orders/{orderId}/details/{detailId}` | 주문 상세 취소 |
| `DELETE` | `/api/orders/{id}` | 전체 주문 취소 |
| `POST` | `/api/orders/{date}/complete` | 배송일 주문 일괄 처리 |

주문 등록 요청:

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

주문 수정 요청:

~~~json
{
  "details": [
    {
      "detailId": 1,
      "productId": 1,
      "quantity": 3
    }
  ]
}
~~~

사용자 주문 조회:

~~~text
GET /api/orders/me?email=user@example.com
GET /api/orders/me?email=user@example.com&deliveryDate=2026-08-31
~~~

관리자 주문 조회:

~~~text
GET /api/orders?email=admin@test.com
GET /api/orders?email=admin@test.com&deliveryDate=2026-08-31
~~~

주문 일괄 처리:

~~~text
POST /api/orders/2026-08-31/complete?email=admin@test.com
~~~

## 주문 상태

주문 상태:

~~~text
ORDERED
MODIFIED
COMPLETED
CANCELED
~~~

주문 상세 상태:

~~~text
ORDERED
MODIFIED
DETAIL_CANCELED
COMPLETED
CANCELED
~~~

`COMPLETED` 또는 `CANCELED` 상태의 주문은 수정하거나 다시 취소할 수 없습니다.

## 배송일 처리 규칙

배송일 기준 조회 범위는 다음과 같습니다.

~~~text
전날 14:00 이상 ≤ 주문 시각 < 배송일 당일 14:00
~~~

- 14시 이전 주문은 당일 배송 대상으로 조회합니다.
- 14시 이후 주문은 다음 날 배송 대상으로 조회합니다.
- `ORDERED`, `MODIFIED` 상태의 주문만 일괄 처리합니다.
- 처리된 주문은 `COMPLETED` 상태로 변경합니다.

## API 응답 형식

대부분의 API는 다음 wrapper를 사용합니다.

~~~json
{
  "resultCode": "200-1",
  "msg": "처리 결과 메시지",
  "data": {}
}
~~~

다음 API는 DTO를 직접 반환합니다.

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/orders/{id}`

## CORS

현재 다음 origin을 허용합니다.

~~~text
https://cdpn.io
http://localhost:3000
http://127.0.0.1:3000
~~~

## 테스트

Windows PowerShell:

~~~powershell
./gradlew.bat test
~~~

macOS/Linux:

~~~bash
./gradlew test
~~~

주문 service 테스트에는 14시 배송 구간 경계값, 상태 변경 및 중복 처리 방지가 포함되어 있습니다.
