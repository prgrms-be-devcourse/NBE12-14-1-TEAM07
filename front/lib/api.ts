import { Product, OrdersDto, UserOrdersDto, OrdersSaveReqBody, RsData } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export async function cancelOrderDetail(
  orderId: number,
  detailId: number
) {
  const response = await fetch(
    `${API_BASE}/api/orders/${orderId}/details/${detailId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("상세 주문 취소 실패");
  }

  return response.json();
}

export async function modifyOrder(
  orderId: number,
  details: {
    detailId: number;
    productId: number;
    quantity: number;
  }[]
) {
  const response = await fetch(
    `http://localhost:8080/api/orders/${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        details: details,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("주문 수정 실패");
  }

  return response.json();
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`상품 목록 조회 실패 (${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products from backend:", error);
    throw error;
  }
}

export interface CreateOrderRequest {
  email: string;
  ordersDetails: {
    productId: number;
    quantity: number;
  }[];
}
export async function createOrder(data: CreateOrderRequest) {
  const response = await fetch("http://localhost:8080/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("주문 처리에 실패했습니다.");
  }
  return response.json();
}
export async function fetchOrders(email: string, deliveryDate? : string): Promise<OrdersDto[]> {
  try {

      const params = new URLSearchParams({ email });
      if (deliveryDate) {
        params.set("deliveryDate", deliveryDate);
      }

      const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`, {
        method : "GET",
        headers: {
          "Content-Type" : "application/json",
        },
        cache : "no-store",
      });

      if(!res.ok) {
        throw new Error(`주문 목록 조회 실패 (${res.status})`);
      }

      const json : RsData<OrdersDto[]> = await res.json();
      return json.data;
  } catch(error) {
    console.error(
      "서버에서 주문 목록을 가져오는데 실패했습니다.", error
    );
    throw error;
  }
}

export async function completeOrders(email: string, date: string): Promise<number> {
  try {
    const params = new URLSearchParams({ email });

    const res = await fetch(`${API_BASE}/api/orders/${date}/complete?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`일괄 처리 실패 (${res.status})`);
    }

    const json: RsData<number> = await res.json();
    return json.data;
  } catch (error) {
    console.error("주문 일괄 처리에 실패했습니다.", error);
    throw error;
  }
}

export async function fetchMyOrders(email : string, deliveryDate? : string): Promise<UserOrdersDto[]> {
  try {
    const params = new URLSearchParams({ email });
    if(deliveryDate) {
      params.set("deliveryDate", deliveryDate);
    }
    
    const res = await fetch(`${API_BASE}/api/orders/me?${params.toString()}`, {
      method : "GET",
      headers: {
        "Content-Type" : "application/json",
      },
      cache : "no-store",
    });

    if(!res.ok) {
      throw new Error(`주문 목록 조회 실패 (${res.status})`);
    }

    const json: RsData<UserOrdersDto[]> = await res.json();
    return json.data;
  } catch(error) {
    console.error(
      "서버에서 주문 목록을 가져오는데 실패했습니다.", error
    );
    throw error;
  }

export async function deleteOrder(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`주문 삭제 실패 (${res.status})`);
    }
  } catch (error) {
    console.error("서버에서 주문을 삭제하는데 실패했습니다.", error);
    throw error;
  }
}

