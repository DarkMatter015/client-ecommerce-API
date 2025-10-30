import type { IAddressRequest, IAddressResponse } from "./address";
import type { IOrderItemRequest, IOrderItemResponse } from "./orderItem";

export interface IOrderRequest {
    orderItems: IOrderItemRequest[];
    address: IAddressRequest;
}

export interface IOrderUpdate {
    orderItems: IOrderItemRequest[];
    address: IAddressRequest;
}

export interface IOrderResponse {
    id: number;
    data: Date;
    userId: number;
    orderItems: IOrderItemResponse[];
    address: IAddressResponse;
}