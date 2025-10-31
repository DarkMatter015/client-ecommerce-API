import type { ICategory } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

export const getAllCategoriesPageable = async (page = 0, size = 10): Promise<IPage<ICategory> | null> => {
    try {
        const response = await api.get(`/categories?page=${page}&size=${size}`);
        return response.data;
    } catch (err) {
            console.error('Erro ao buscar todos os produtos na rota /categories', err);
            return null;
    }
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    } catch (err) {
            console.error(`Erro ao buscar o produto com ${id} na rota /categories/${id}`, err);
            return null;
    }
}