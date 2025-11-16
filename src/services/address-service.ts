import type { IAddress, IResponse } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/Utils";

const route = "/addresses";

type ApiAddress = Record<string, any>;

const mapApiToAddress = (item: ApiAddress): IAddress => {
  return {
    id: item.id ?? item.ID ?? 0,
    street: item.street ?? "",
    number: item.number ?? "",
    complement: item.complement ?? "",
    neighborhood: item.neighborhood ?? "",
    city: item.city ?? "",
    state: item.state ?? "",
    cep: item.cep ?? "",
  };
};

export const getAllAddressesPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IAddress> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToAddress);
  } catch (err) {
    console.error(`Erro ao buscar todos os endereços na rota ${route}`, err);
    return null;
  }
};

export const getAddressById = async (id: string): Promise<IAddress | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      `Erro ao buscar o endereço com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};

export const validateCep = async (cep: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`/cep/validate/${cep}`);
    response = {
      status: data.status,
      success: true,
      message: "CEP válido",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 400,
      success: false,
      message: err.response?.data?.message ?? "CEP inválido",
      data: err.response?.data,
    };
  }
  return response;
};

export const createAddress = async (
  address: Partial<IAddress>
): Promise<IAddress | null> => {
  try {
    const response = await api.post(route, address);
    return mapApiToAddress(response.data);
  } catch (err) {
    console.error(`Erro ao criar o endereço na rota ${route}`, err);
    return null;
  }
};
