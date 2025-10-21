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

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

// Interfaces para os dados de autenticação
export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  email: string;
  displayName: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}