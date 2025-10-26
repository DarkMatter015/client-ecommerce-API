export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    urlImage: string;
    category: Category;
}

export interface Category {
    id: number;
    name: string;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}