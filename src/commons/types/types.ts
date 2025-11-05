export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface IPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface IUserRegister {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

// Interfaces para os dados de autenticação
export interface IAuthorities {
  authority: string;
}

export interface IAuthenticatedUser {
  email: string;
  displayName: string;
  authorities: IAuthorities[];
}

export interface IAuthenticationResponse {
  token: string;
  user: IAuthenticatedUser;
}

export interface IUserResponse {
    id: number;
    email: string;
    displayName: string;
}


export interface ICategory {
    id: number;
    name: string;
}

export interface IPayment {
    id: number;
    name: string;
}

export interface IAddress {
    id: number;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    urlImage: string;
    category: ICategory;
}

export interface IItem {
    id?: number;
    product: IProduct;
    totalPrice?: number;
    quantity: number;
}