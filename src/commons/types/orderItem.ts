import type { IProduct } from "./product";

export interface IOrderItemRequest {
    orderId: number;
    productId: number;
    quantity: number;
}

export interface IOrderItemResponse {
    id: number;
    orderId: number;
    product: IProduct;
    totalPrice: number;
    quantity: number;
}

export interface IOrderItemUpdate {
    quantity: number;
}