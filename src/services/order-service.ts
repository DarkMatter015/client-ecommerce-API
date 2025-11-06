import type { IOrderResponse, IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";


type ApIOrderRequest = Record<string, any>;

const mapApiToOrder = (order: ApIOrderRequest): IOrderResponse => {
    return {
        id: order.id ?? order.ID ?? 0,
        payment:  order.payment,
        address: order.address,
        orderItems: order.orderItems
    };
};

const normalizePage = (data: any, page = 0, size = 10): IPage<IOrderResponse> => {
    // If API returned an array
    if (Array.isArray(data)) {
        const content = data.map(mapApiToOrder);
        return {
            content,
            totalElements: content.length,
            totalPages: 1,
            size: content.length,
            number: 0,
        };
    }

    // If API returned a Page-like object with `content`
    if (data && Array.isArray(data.content)) {
        const content = data.content.map(mapApiToOrder);
        return {
            content,
            totalElements: Number(data.totalElements ?? data.total ?? content.length),
            totalPages: Number(data.totalPages ?? Math.ceil((data.totalElements ?? content.length) / (data.size ?? size))),
            size: Number(data.size ?? size),
            number: Number(data.number ?? data.page ?? page),
        };
    }

    // HAL-like responses (e.g. _embedded.products)
    if (data && data._embedded) {
        const firstKey = Object.keys(data._embedded)[0];
        const arr = data._embedded[firstKey];
        if (Array.isArray(arr)) {
            const content = arr.map(mapApiToOrder);
            return {
                content,
                totalElements: content.length,
                totalPages: 1,
                size: content.length,
                number: 0,
            };
        }
    }

    // Fallback: return empty page
    return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
    };
};

export const getAllOrdersPageable = async (page = 0, size = 10): Promise<IPage<IOrderResponse> | null> => {
    try {
        const response = await api.get(`/orders?page=${page}&size=${size}`);
        return normalizePage(response.data, page, size);
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