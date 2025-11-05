import type { IAddress } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";


type ApiAddress = Record<string, any>;

const mapApiToAddress = (item: ApiAddress): IAddress => {
    return {
        id: item.id ?? item.ID ?? 0,
        street:  item.street ?? '',
        number:  item.number ?? '',
        complement:  item.complement ?? '',
        neighborhood:  item.neighborhood ?? '',
        city:  item.city ?? '',
        state:  item.state ?? '',
        cep:  item.cep ?? '',
    };
};

const normalizePage = (data: any, page = 0, size = 10): IPage<IAddress> => {
    // If API returned an array
    if (Array.isArray(data)) {
        const content = data.map(mapApiToAddress);
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
        const content = data.content.map(mapApiToAddress);
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
            const content = arr.map(mapApiToAddress);
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

export const getAllAddressesPageable = async (page = 0, size = 10): Promise<IPage<IAddress> | null> => {
    try {
        const response = await api.get(`/address?page=${page}&size=${size}`);
        return normalizePage(response.data, page, size);
    } catch (err) {
            console.error('Erro ao buscar todos os endereços na rota /address', err);
            return null;
    }
};

export const getAddressById = async (id: string): Promise<IAddress | null> => {
    try {
        const response = await api.get(`/address/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o endereço com ${id} na rota /address/${id}`, err);
            return null;
    }
}