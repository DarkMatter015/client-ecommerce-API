import type { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    urlImage: string;
    category: Category;
}