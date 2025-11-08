import { normalizePage } from '@/utils/Utils';
import type { IPage, IProduct } from '../commons/types/types';
import { api } from '../lib/axios';

const route = '/products';

type ApiProduct = Record<string, any>;

const mapApiToProduct = (item: ApiProduct): IProduct => {
    return {
        id: item.id ?? item.ID ?? 0,
        name:  item.name ?? '',
        description: item.description ?? '',
        price: Number(item.price ?? 0),
        urlImage:  item.urlImage ?? '',
        category: item.category ?? { id: 0, name: '' },
    };
};


export const getAllProductsPageable = async (page = 0, size = 10): Promise<IPage<IProduct>> => {
    try {
        const response = await api.get(`${route}?page=${page}&size=${size}`);
        return normalizePage(response.data, page, size, mapApiToProduct);
    } catch (err) {
            console.error(`Erro ao buscar produtos na rota ${route}`, err);
            throw err;
    }
};

export const getProductById = async (id: string): Promise<IProduct> => {
    try {
        const response = await api.get(`${route}/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o produto com ${id} na rota ${route}/${id}`, err);
            throw err;
    }
};