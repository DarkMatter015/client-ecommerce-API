import type { IPayment } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/Utils";

const route = "/payments";

type ApiPayment = Record<string, any>;

const mapApiToPayment = (item: ApiPayment): IPayment => {
  return {
    id: item.id ?? item.ID ?? 0,
    name: item.name ?? "",
  };
};

export const getAllPaymentsPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IPayment> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToPayment);
  } catch (err) {
    console.error(`Erro ao buscar todos os pagamentos na rota ${route}`, err);
    return null;
  }
};

export const getPaymentById = async (id: string): Promise<IPayment | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      `Erro ao buscar o pagamento com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};
