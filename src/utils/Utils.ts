import type { IPage } from "@/commons/types/types";

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getItemCountText = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};

export const scrollIntoView = (id: string): void => {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "smooth" });
};

export const normalizePage = (data: any, page = 0, size = 10, mapApiTo: (item: any) => any): IPage<any> => {
    // If API returned an array
    if (Array.isArray(data)) {
        const content = data.map(mapApiTo);
        return {
            content,
            totalElements: content.length,
            totalPages: 1,
            size: content.length,
            number: 0,
        };
    }

    // If API returned a Page-like object with `content`
    if (data && Array.isArray(data.content)) {
        const content = data.content.map(mapApiTo);
        return {
            content,
            totalElements: Number(data.totalElements ?? data.total ?? content.length),
            totalPages: Number(data.totalPages ?? Math.ceil((data.totalElements ?? content.length) / (data.size ?? size))),
            size: Number(data.size ?? size),
            number: Number(data.number ?? data.page ?? page),
        };
    }

    // HAL-like responses (e.g. _embedded.products)
    if (data && data._embedded) {
        const firstKey = Object.keys(data._embedded)[0];
        const arr = data._embedded[firstKey];
        if (Array.isArray(arr)) {
            const content = arr.map(mapApiTo);
            return {
                content,
                totalElements: content.length,
                totalPages: 1,
                size: content.length,
                number: 0,
            };
        }
    }

    // Fallback: return empty page
    return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
    };
};