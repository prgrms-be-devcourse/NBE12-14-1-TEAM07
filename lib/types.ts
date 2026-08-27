export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  createDate?: string;
  modifyDate?: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
