import type { IProduct } from "@/commons/types/types";

export const SelectedItemTemplate = (item: IProduct | null) => {
    return item ? `${item.name}` : "";
};
