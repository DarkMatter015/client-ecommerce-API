import type { IPayment } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

type ApiPayment = Record<string, any>;

const mapApiToPayment = (item: ApiPayment): IPayment => {
    return {
        id: item.id ?? item.ID ?? 0,
        name:  item.name ?? '',
    };
};

const normalizePage = (data: any, page = 0, size = 10): IPage<IPayment> => {
    // If API returned an array
    if (Array.isArray(data)) {
        const content = data.map(mapApiToPayment);
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
        const content = data.content.map(mapApiToPayment);
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
            const content = arr.map(mapApiToPayment);
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

export const getAllPaymentsPageable = async (page = 0, size = 10): Promise<IPage<IPayment> | null> => {
    try {
        const response = await api.get(`/payments?page=${page}&size=${size}`);
        return normalizePage(response.data, page, size);
    } catch (err) {
            console.error('Erro ao buscar todos os pagamentos na rota /payments', err);
            return null;
    }
};

export const getPaymentById = async (id: string): Promise<IPayment | null> => {
    try {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o pagamento com ${id} na rota /payments/${id}`, err);
            return null;
    }
}