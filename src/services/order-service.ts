import type { IOrderResponse } from "@/commons/types/order";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

export const getAllOrdersPageable = async (page = 0, size = 10): Promise<IPage<IOrderResponse> | null> => {
    try {
        const response = await api.get(`/orders?page=${page}&size=${size}`);
        return response.data;
    } catch (err) {
            console.error('Erro ao buscar todos os pedidos na rota /orders', err);
            return null;
    }
};

export const getOrderById = async (id: string): Promise<IOrderResponse | null> => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o pedido com ${id} na rota /orders/${id}`, err);
            return null;
    }
}