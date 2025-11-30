import type { ICategory } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";

const route = "/categories";

export const getAllCategoriesPageable = async (
  page = 0,
  size = 10
): Promise<IPage<ICategory> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return response.data;
  } catch (err) {
    console.error(`Erro ao buscar todas as categorias na rota ${route}`, err);
    return null;
  }
};

export const getAllCategoriesFiltered = async (
  page = 0,
  size = 10,
  name: string
): Promise<IPage<ICategory> | null> => {
  try {
    const searchParam = name ? `&name=${encodeURIComponent(name)}` : "";
    const response = await api.get(`${route}/filter?page=${page}&size=${size}${searchParam}`);
    return response.data;
  } catch (err) {
    console.error(`Erro ao buscar as categorias ${name} na rota ${route}`, err);
    return null;
  }
};

export const getCategoryById = async (
  id: string
): Promise<ICategory | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      `Erro ao buscar a categoria com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};
