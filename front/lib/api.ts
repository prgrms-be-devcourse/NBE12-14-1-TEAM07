import { Product, OrdersDto, UserOrdersDto, RsData } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

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