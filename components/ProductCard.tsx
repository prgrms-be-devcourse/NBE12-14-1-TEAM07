"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const formattedPrice = `${product.price.toLocaleString("ko-KR")}원`;

  return (
    <div className="bg-white border border-line rounded-[12px] overflow-hidden flex flex-col shadow-none hover:shadow-xs transition-shadow">
      {/* Product Image Area */}
      <div className="relative h-[130px] w-full bg-product-stripe flex items-center justify-center border-b border-line2 overflow-hidden select-none">
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-mono text-[11px] text-faint tracking-tight">
            {product.name}
          </span>
        )}
      </div>

      {/* Product Info Area */}
      <div className="p-[14px_16px_16px] flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[15px] font-bold text-ink tracking-[-0.01em]">
            {formattedPrice}
          </span>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="text-[13px] font-semibold text-white bg-ink px-[18px] py-[9px] rounded-lg cursor-pointer hover:bg-black active:scale-[0.98] transition-all"
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
