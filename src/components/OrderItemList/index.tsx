import type React from "react";
import type { IItem } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";

import "./order-item-list.style.css";


export const OrderItemList: React.FC<{ item: IItem, index: number }> = ({item}) => {
    return (
        <div className="order-item-detail">
            <div className="order-item-image">
                <img
                    src={item.product.urlImage}
                    alt={item.product.name}
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.png';
                    }}
                />
            </div>
            <div className="order-item-info">
                <h4>{item.product.name}</h4>
                <p className="order-item-description">{item.product.description}</p>
                <div className="order-item-meta">
                    <span className="item-category">
                        <i className="pi pi-tag"></i>
                        {item.product.category.name}
                    </span>
                    <span className="item-quantity">
                        <i className="pi pi-shopping-cart"></i>
                        Qtd: {item.quantity}
                    </span>
                    <span className="item-price">
                        R$ {formatCurrency(item.product.price)} cada
                    </span>
                </div>
                <div className="order-item-total">
                    Total: R$ {formatCurrency(item.totalPrice || 0)}
                </div>
            </div>
        </div>
    )
}