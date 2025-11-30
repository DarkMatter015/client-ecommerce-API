import type { IFreightRequest, IResponse } from "@/commons/types/types";

import { api } from "@/lib/axios";

export const calculateFreightByProducts = async (freight: IFreightRequest): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`/shipment/products`, {
      ...freight,
    });
    response = {
      status: data.status,
      success: true,
      message: "Frete Calculado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 400,
      success: false,
      message: err.response?.data?.message ?? "Erro ao calcular frete",
      data: err.response?.data,
    };
  }
  return response;
};