import { Product } from "./types";

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
