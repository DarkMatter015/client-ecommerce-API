import type { IOrderResponse, IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/Utils";

const route = "/orders";

type ApIOrderRequest = Record<string, any>;

const mapApiToOrder = (order: ApIOrderRequest): IOrderResponse => {
  return {
    id: order.id ?? order.ID ?? 0,
    payment: order.payment,
    address: order.address,
    orderItems: order.orderItems,
  };
};

export const getAllOrdersPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IOrderResponse> | null> => {
  try {
    const response = await api.get(`${route}?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToOrder);
  } catch (err) {
    console.error(`Erro ao buscar todos os pedidos na rota ${route}`, err);
    return null;
  }
};

export const getOrderById = async (
  id: string
): Promise<IOrderResponse | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      `Erro ao buscar o pedido com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};
