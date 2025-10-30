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