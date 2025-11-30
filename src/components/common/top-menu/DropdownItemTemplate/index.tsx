import type { IProduct } from "@/commons/types/types";

export const DropDownItemTemplate = (item: IProduct | null) => {
    if (!item) return null;
    return (
        <div className="flex align-items-center">
            <img
                alt={item.name}
                src={item.urlImage}
                className="search-item-image"
                style={{ width: 36, height: 36, marginRight: 8 }}
            />
            <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    R${" "}
                    {item.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                    })}
                </div>
            </div>
        </div>
    );
};
