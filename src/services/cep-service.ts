import type { IResponse } from "@/commons/types/types";

import { api } from "@/lib/axios";

export const validateCep = async (cep: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    cep = cep.replace(/[^0-9]/g, '')
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