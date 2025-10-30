import type { IOrderItemResponse } from "@/commons/types/orderItem";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

export const getAllOrderItemsPageable = async (page = 0, size = 10): Promise<IPage<IOrderItemResponse> | null> => {
    try {
        const response = await api.get(`/orderItems?page=${page}&size=${size}`);
        return response.data;
    } catch (err) {
            console.error('Erro ao buscar todos os itens de pedido na rota /orderItems', err);
            return null;
    }
};

export const getOrderItemById = async (id: string): Promise<IOrderItemResponse | null> => {
    try {
        const response = await api.get(`/orderItems/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o item de pedido com ${id} na rota /orderItems/${id}`, err);
            return null;
    }
}