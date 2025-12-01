import type {
  IAddress,
  IItem,
  IOrderResponse,
  IPage,
  IPayment,
} from "@/commons/types/types";
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
    shipment: order.shipment,
    status: order.status,
  };
};

export const getAllOrdersPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IOrderResponse> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
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

export const postOrder = async (
  cartItems: IItem[] | undefined,
  selectedAddress: IAddress | null,
  paymentMethod: IPayment | null,
  shipmentId: number | null
) => {
  try {
    const response = await api.post("/orders", {
      orderItems: cartItems?.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      address: selectedAddress,
      paymentId: paymentMethod?.id,
      shipmentId: shipmentId,
    });
    return response;
  } catch (err) {
    console.error(`Erro ao realizar pedido na rota ${route}`, err);
  }
};
