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