"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";
import { Product, CartItem } from "@/lib/types";
import { fetchProducts } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (err: any) {
        console.error("Failed to load products from API:", err);
        setError("상품 정보를 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQty = (productId: number, newQty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <div className="min-h-screen bg-canvas p-0 sm:p-6 md:p-8 flex justify-center items-start">
      {/* 1180px Main Container */}
      <div className="w-full max-w-[1180px] bg-page border border-line rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="px-7 pt-[30px] pb-[22px] flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <h1 className="font-extrabold tracking-[-0.02em] text-[29px] leading-[1.35] text-ink whitespace-pre-line">
              오늘 볶은 원두를,{"\n"}내일 아침 문 앞에.
            </h1>
            <p className="mt-2.5 text-[13.5px] text-muted">
              소량 로스팅한 싱글 오리진 원두를 주문 다음 날 받아보세요.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-ink text-[#f4f5f7] text-[12.5px] font-semibold px-4 py-2.5 rounded-full w-fit shrink-0">
            <span className="w-[7px] h-[7px] rounded-full bg-live" />
            <span>오후 2시 이전 주문은 당일 발송</span>
          </div>
        </section>

        {/* Main 2-Column Section */}
        <div className="flex flex-col lg:flex-row gap-[22px] px-7 pb-7 items-start">
          {/* Products Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="py-16 text-center text-muted bg-white border border-line rounded-[12px]">
                <div className="animate-spin inline-block w-6 h-6 border-[2.5px] border-current border-t-transparent text-ink rounded-full mb-2" />
                <p className="text-[13px]">상품 목록을 불러오는 중입니다...</p>
              </div>
            ) : error ? (
              <div className="py-16 text-center text-danger bg-white border border-line rounded-[12px]">
                <p className="text-[14px] font-semibold mb-1">오류 발생</p>
                <p className="text-[12.5px] text-muted">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-ink text-white text-[12.5px] font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
                >
                  다시 시도
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-muted bg-white border border-line rounded-[12px]">
                <p className="text-[13.5px]">등록된 상품이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Order Form */}
          <OrderForm
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
}
