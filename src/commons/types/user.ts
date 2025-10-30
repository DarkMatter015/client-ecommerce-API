export interface IUserResponse {
    id: number;
    email: string;
    displayName: string;
}

export interface IUserUpdate {
    displayName: string;
    password: string;
}