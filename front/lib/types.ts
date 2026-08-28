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

export type OrderStatus = "ORDERED" | "COMPLETED";
export type OrderDetailStatus = "ORDERED" | "CANCELED" | "COMPLETED";

export interface OrdersDetailDto {
  id : number;
  ordersId : number;
  productId : number;
  productName : string;
  quantity : number;
  totalPrice : number;
  status : OrderDetailStatus;
}

export interface OrdersDto {
  id : number;
  createDate : string;
  modifyDate : string;
  email : string;
  orderStatus : OrderStatus;
  ordersDetails : OrdersDetailDto[];
}

export interface UserOrdersDto {
  id : number;
  modifyDate : string;
  ordersDetails : OrdersDetailDto[];
}

export interface OrdersDetailRequest {
  productId: number;
  quantity: number;
}

export interface OrdersSaveReqBody {
  email: string;
  ordersDetails: OrdersDetailRequest[];
}

export interface RsData<T> {
  data : T;
  msg : string;
  resultCode : string;
}