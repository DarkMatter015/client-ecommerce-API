import type { IItem } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import type React from "react";

export const ItemCartCheckout: React.FC<{
    item: IItem
}> = ({
    item
}) => {
        return (
            <article key={item.id} className="order-item" aria-label={item.product.name}>
                <div className="order-item-image">
                    <img src={item.product.urlImage} alt={item.product.urlImage} />
                </div>
                <div className="order-item-details">
                    <h4 className="order-item-name">{item.product.name}</h4>
                    <p className="order-item-meta">{item.product.category.name}</p>
                    <p className="order-item-quantity">Quantidade: {item.quantity}</p>
                </div>
                <div className="order-item-price">
                    <span>R$ {formatCurrency(item.totalPrice)}</span>
                </div>
            </article>
        );
    }