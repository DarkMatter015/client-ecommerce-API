import type { Product } from '../commons/types/product';
import type { Page } from '../commons/types/types';
import { api } from '../lib/axios';

type ApiProduct = Record<string, any>;

const mapApiToProduct = (item: ApiProduct): Product => {
    return {
        id: item.id ?? item.ID ?? 0,
        name:  item.name ?? '',
        description: item.description ?? '',
        price: Number(item.price ?? 0),
        urlImage:  item.urlImage ?? '',
        category: item.category ?? { id: 0, name: '' },
    };
};

const normalizePage = (data: any, page = 0, size = 10): Page<Product> => {
    // If API returned an array
    if (Array.isArray(data)) {
        const content = data.map(mapApiToProduct);
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
        const content = data.content.map(mapApiToProduct);
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
            const content = arr.map(mapApiToProduct);
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

export const getProducts = async (page = 0, size = 10): Promise<Page<Product>> => {
    try {
        const response = await api.get(`/products?page=${page}&size=${size}`);
        return normalizePage(response.data, page, size);
    } catch (err) {
            console.error('Erro ao buscar produtos na rota /products', err);
            throw err;
    }
};

export const getAllProducts = async (): Promise<Page<Product>> => {
    try {
        const response = await api.get(`/products`);
        return normalizePage(response.data);
    } catch (err) {
            console.error('Erro ao buscar todos os produtos na rota /products', err);
            return normalizePage([]);
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o produto com ${id} na rota /products/${id}`, err);
            throw err;
    }
};