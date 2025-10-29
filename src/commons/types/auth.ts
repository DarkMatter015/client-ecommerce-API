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