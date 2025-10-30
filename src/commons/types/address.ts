import type { IUserResponse } from "./user";

export interface IAddressRequest {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

export interface IAddressResponse {
    id: number;
    user: IUserResponse;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

export interface IAddressUpdate {
    quantity: number;
}