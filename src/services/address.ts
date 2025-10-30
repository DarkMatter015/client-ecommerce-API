import type { IAddressResponse } from "@/commons/types/address";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

export const getAllAddressesPageable = async (page = 0, size = 10): Promise<IPage<IAddressResponse> | null> => {
    try {
        const response = await api.get(`/address?page=${page}&size=${size}`);
        return response.data;
    } catch (err) {
            console.error('Erro ao buscar todos os endereços na rota /address', err);
            return null;
    }
};

export const getAddressById = async (id: string): Promise<IAddressResponse | null> => {
    try {
        const response = await api.get(`/address/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o endereço com ${id} na rota /address/${id}`, err);
            return null;
    }
}