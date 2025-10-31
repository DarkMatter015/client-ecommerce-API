
import type { IResponse, IUserLogin, IUserRegister, IUserResponse } from "@/commons/types/types";
import { api } from "@/lib/axios";

/**
 * Função para realizar uma requisição HTTP para API para cadastrar um novo usuário
 * @param user - Dados do usuário que será cadastrado do tipo IUserRegister
 * @returns - Retorna a resposta da API
 */
const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/users", user);
    response = {
      status: data.status,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };  
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Usuário não pode ser cadastrado",
      data: err.response.data,
    };
  }
  return response;
};

/**
 * Função para realizar a autenticação do usuário
 * @param user - Dados do usuário que será autenticado do tipo IUserLogin (username e password)
 * @returns - Retorna a resposta da API
 * Além disso salva o token no localStorage e adiciona o token no cabeçalho da requisição
 */
const login = async (user: IUserLogin) => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);
    response = {
      status: data.status,
      success: true,
      message: "Login bem-sucedido",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Usuário ou senha inválidos",
      data: err.response.data,
    };
  }
  return response;
};

const validateToken = async (token: string | null): Promise<IResponse> => {
  if (!token) {
    return {
      status: 401,
      success: false,
      message: "Token ausente",
    };
  }

  try {
    const response = await api.get("/auth/validate", {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    });

    return {
      status: response.status,
      success: true,
      message: "Token válido",
      data: response.data,
    };
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      status === 401
        ? "Token inválido ou expirado"
        : "Erro ao validar o token";

    return {
      status,
      success: false,
      message,
      data: err?.response?.data ?? null,
    };
  }
};

const getUser = async (): Promise<IUserResponse | IResponse> => {

  try {
    const response = await api.get("/users");

    return {
      id: response.data.id,
      email: response.data.email,
      displayName: response.data.displayName,
    };
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      status === 401
        ? "Usuário não encontrado"
        : "Erro ao buscar o usuário";

    return {
      status,
      success: false,
      message,
      data: err?.response?.data ?? null,
    };
  }
};


const AuthService = {
  signup,
  login, 
  validateToken, 
  getUser
};
export default AuthService;