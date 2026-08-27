"use client";

import { useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/AdminHeader";
import StatusPill from "@/components/StatusPill";
import ConfirmDialog from "@/components/ConfirmDialog";

interface AdminProduct {
  id: number;
  name: string;
  price: number;
  status: "판매중" | "숨김";
  imageUrl: string;
}

const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = [
  {
    id: 1,
    name: "하우스 블랜드",
    price: 15000,
    status: "판매중",
    imageUrl: "/images/bean1.jpg",
  },
  {
    id: 2,
    name: "케냐",
    price: 17000,
    status: "판매중",
    imageUrl: "/images/bean2.jpg",
  },
  {
    id: 3,
    name: "디카페인 하우스 블랜드",
    price: 16000,
    status: "판매중",
    imageUrl: "/images/bean3.jpg",
  },
  {
    id: 4,
    name: "베란다 블랜드",
    price: 15500,
    status: "판매중",
    imageUrl: "/images/bean4.jpg",
  },
  {
    id: 5,
    name: "디카페인 콜롬비아",
    price: 15000,
    status: "숨김",
    imageUrl: "/images/bean1.jpg",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [formMode, setFormMode] = useState<"등록" | "수정">("수정");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    INITIAL_ADMIN_PRODUCTS[0]
  );

  // Form states
  const [formName, setFormName] = useState(INITIAL_ADMIN_PRODUCTS[0].name);
  const [formPrice, setFormPrice] = useState(String(INITIAL_ADMIN_PRODUCTS[0].price));
  const [formStatus, setFormStatus] = useState<"판매중" | "숨김">(INITIAL_ADMIN_PRODUCTS[0].status);
  const [formImageUrl, setFormImageUrl] = useState<string>(INITIAL_ADMIN_PRODUCTS[0].imageUrl);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Select product to edit
  const handleSelectProduct = (prod: AdminProduct) => {
    setFormMode("수정");
    setSelectedProduct(prod);
    setFormName(prod.name);
    setFormPrice(String(prod.price));
    setFormStatus(prod.status);
    setFormImageUrl(prod.imageUrl);
  };

  // Switch to new product mode
  const handleNewProduct = () => {
    setFormMode("등록");
    setSelectedProduct(null);
    setFormName("");
    setFormPrice("");
    setFormStatus("판매중");
    setFormImageUrl("/images/bean1.jpg");
  };

  // Save product form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(formPrice.replace(/,/g, ""), 10);
    if (!formName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("올바른 가격을 입력해주세요.");
      return;
    }

    if (formMode === "수정" && selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                name: formName.trim(),
                price: priceNum,
                status: formStatus,
                imageUrl: formImageUrl,
              }
            : p
        )
      );
      alert("상품 정보가 수정되었습니다.");
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      const newProd: AdminProduct = {
        id: newId,
        name: formName.trim(),
        price: priceNum,
        status: formStatus,
        imageUrl: formImageUrl || "/images/bean1.jpg",
      };
      setProducts((prev) => [newProd, ...prev]);
      handleSelectProduct(newProd);
      alert("새 상품이 등록되었습니다.");
    }
  };

  // Confirm delete product
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    setDeleteModalOpen(false);
    if (selectedProduct?.id === productToDelete.id) {
      const remaining = products.filter((p) => p.id !== productToDelete.id);
      if (remaining.length > 0) {
        handleSelectProduct(remaining[0]);
      } else {
        handleNewProduct();
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas p-0 sm:p-6 md:p-8 flex justify-center items-start">
      {/* 1180px Main Container */}
      <div className="w-full max-w-[1180px] bg-page border border-line rounded-[12px] shadow-sm overflow-hidden flex flex-col">
        {/* Admin Header */}
        <AdminHeader />

        {/* Toolbar */}
        <div className="p-[24px_28px_0] flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-extrabold tracking-[-0.02em] text-[22px] text-ink">
              상품 관리
            </h1>
            <span className="text-[13px] text-faint">전체 {products.length}개</span>
          </div>
          <button
            type="button"
            onClick={handleNewProduct}
            className="h-[42px] px-4.5 bg-ink text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-black active:scale-[0.99] transition-all cursor-pointer"
          >
            + 새 상품 등록
          </button>
        </div>

        {/* Main 2-Column: Table & Form */}
        <div className="flex flex-col lg:flex-row gap-[22px] p-[18px_28px_28px] items-start">
          {/* Left Column: Products Table */}
          <div className="flex-1 w-full bg-white border border-line rounded-[12px] overflow-hidden shadow-2xs">
            {/* Table Header */}
            <div className="grid grid-cols-[52px_1fr_100px_80px_120px] gap-3 items-center px-4.5 py-3 bg-page border-b border-line2 text-[11.5px] font-semibold text-faint">
              <span>사진</span>
              <span>상품명</span>
              <span>가격</span>
              <span>상태</span>
              <span></span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-line3">
              {products.map((prod) => {
                const isSelected = formMode === "수정" && selectedProduct?.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    className={`grid grid-cols-[52px_1fr_100px_80px_120px] gap-3 items-center px-4.5 py-2.5 transition-colors ${
                      isSelected ? "bg-selected" : "bg-white hover:bg-hover/50"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-product-stripe border border-line2 shrink-0">
                      <Image
                        src={prod.imageUrl}
                        alt={prod.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Name */}
                    <span className="text-[13.5px] font-semibold text-ink truncate">
                      {prod.name}
                    </span>

                    {/* Price */}
                    <span className="text-[13px] font-semibold text-ink">
                      {prod.price.toLocaleString("ko-KR")}원
                    </span>

                    {/* Status */}
                    <div>
                      <StatusPill status={prod.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(prod)}
                        className="text-[12.5px] font-semibold px-2.5 py-1 rounded-[7px] border border-field text-ink hover:bg-hover transition-colors cursor-pointer"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProductToDelete(prod);
                          setDeleteModalOpen(true);
                        }}
                        className="text-[12.5px] font-semibold px-2.5 py-1 rounded-[7px] text-danger hover:bg-danger-bg transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notice Footer */}
            <div className="p-[12px_18px] text-[12px] text-faint border-t border-line3">
              상품을 삭제해도 이미 등록된 주문 내역에는 영향이 없어요.
            </div>
          </div>

          {/* Right Column: Product Form */}
          <div className="w-full lg:w-[360px] flex-none bg-white border border-line rounded-[12px] p-5 shadow-xs">
            <h2 className="font-bold tracking-[-0.01em] text-[16px] text-ink">
              {formMode === "수정" ? "상품 수정" : "새 상품 등록"}
            </h2>
            <p className="mt-1 text-[12.5px] text-faint">
              {formMode === "수정"
                ? `${selectedProduct?.name || "선택한 상품"} 정보를 변경합니다`
                : "새 원두 상품을 등록합니다"}
            </p>

            <form onSubmit={handleSaveForm} className="mt-4 flex flex-col gap-3">
              {/* Product Name */}
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">
                  상품명
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="예: 하우스 블랜드 200g"
                  required
                  className="w-full h-9.5 px-3 border border-field rounded-lg text-[13px] text-ink bg-white focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {/* Price & Status Row */}
              <div className="flex gap-2.5">
                <div className="flex-1">
                  <label className="block text-[12px] font-semibold text-muted mb-1">
                    가격
                  </label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="15000"
                    required
                    className="w-full h-9.5 px-3 border border-field rounded-lg text-[13px] text-ink bg-white focus:outline-none focus:border-ink transition-colors"
                  />
                </div>

                <div className="w-[110px] flex-none">
                  <label className="block text-[12px] font-semibold text-muted mb-1">
                    판매 상태
                  </label>
                  <div className="flex h-9.5 border border-field rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormStatus("판매중")}
                      className={`flex-1 text-[12px] font-semibold transition-colors cursor-pointer ${
                        formStatus === "판매중"
                          ? "bg-ink text-white"
                          : "text-muted hover:bg-hover"
                      }`}
                    >
                      판매중
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus("숨김")}
                      className={`flex-1 text-[12px] font-semibold transition-colors cursor-pointer ${
                        formStatus === "숨김"
                          ? "bg-ink text-white"
                          : "text-muted hover:bg-hover"
                      }`}
                    >
                      숨김
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Upload Dropzone / Preview */}
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">
                  상품 사진
                </label>
                <div className="relative h-[84px] border-[1.5px] border-dashed border-field rounded-[9px] flex items-center justify-center text-[12px] text-faint hover:bg-hover/40 transition-colors cursor-pointer select-none overflow-hidden">
                  {formImageUrl ? (
                    <div className="flex items-center gap-3 px-3 w-full">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-line shrink-0">
                        <Image
                          src={formImageUrl}
                          alt={formName || "상품 이미지"}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[12px] font-semibold text-ink truncate">
                          {formImageUrl.split("/").pop()}
                        </p>
                        <p className="text-[11px] text-faint">클릭하여 이미지 변경</p>
                      </div>
                    </div>
                  ) : (
                    "이미지를 끌어다 놓거나 클릭해서 업로드"
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  className="flex-1 h-[42px] flex items-center justify-center bg-ink text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  {formMode === "수정" ? "수정 저장" : "등록하기"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedProduct) {
                      handleSelectProduct(selectedProduct);
                    } else {
                      handleNewProduct();
                    }
                  }}
                  className="w-[90px] h-[42px] flex items-center justify-center border border-field text-muted rounded-[9px] text-[13.5px] font-semibold hover:bg-hover transition-colors cursor-pointer"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        title="상품을 삭제할까요?"
        description={`${productToDelete?.name} · 이미 등록된 주문에는 영향이 없어요.`}
        confirmText="삭제하기"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
