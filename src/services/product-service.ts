import { normalizePage } from "@/utils/Utils";
import type { IPage, IProduct } from "../commons/types/types";
import { api } from "../lib/axios";

const route = "/products";

type ApiProduct = Record<string, any>;

const mapApiToProduct = (item: ApiProduct): IProduct => {
  return {
    id: item.id ?? item.ID ?? 0,
    name: item.name ?? "",
    description: item.description ?? "",
    price: Number(item.price ?? 0),
    urlImage: item.urlImage ?? "",
    category: item.category ?? { id: 0, name: "" },
    quantityAvailableInStock: Number(item.quantityAvailableInStock ?? 0),
  };
};

export const getAllProductsPageable = async (
  page = 0,
  size = 8
): Promise<IPage<IProduct>> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToProduct);
  } catch (err) {
    console.error(`Erro ao buscar produtos na rota ${route}`, err);
    throw err;
  }
};


export const getAllProductsFiltered = async (
  page = 0,
  size = 8,
  name: string | undefined,
  category: string | undefined
): Promise<IPage<IProduct>> => {
  try {
    const searchParam = category ? `&category=${category}` : "";
    const searchParamName = name ? `&name=${name}` : "";
    const response = await api.get(`${route}/filter?page=${page}&size=${size}${searchParamName}${searchParam}`);
    return normalizePage(response.data, page, size, mapApiToProduct);
  } catch (err) {
    console.error(`Erro ao buscar produtos com a categoria de ${category} na rota ${route}`, err);
    throw err;
  }
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const idFormated = id.trim().replace(/[^0-9]/g, "");
  try {
    if (idFormated && idFormated !== "") {
      const response = await api.get(`${route}/${idFormated}`);
      return response.data;
    }
    throw new Error("ID inválido");
  } catch (err) {
    console.error(
      `Erro ao buscar o produto com %s na rota ${route}`,
      err,
      idFormated
    );
    throw err;
  }
};
