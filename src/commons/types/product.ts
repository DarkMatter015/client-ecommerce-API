import type { ICategory } from "./category";

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    urlImage: string;
    category: ICategory;
}