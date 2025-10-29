export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}