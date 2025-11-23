import type React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatCurrency } from "@/utils/Utils";
import type { IFreightResponse } from "@/commons/types/types";
import "./freight-list.style.css";
import { CartContext } from "@/context/CartContext";
import { use, useState } from "react";

export const FreightList: React.FC<{
    freights: IFreightResponse[];
}> = ({ freights }) => {

    const getDiscountedPrice = (price: number, discount: number) => {
        return price - (price * discount) / 100;
    };

    const companyTemplate = (rowData: IFreightResponse) => {
        return (
            <div className="company-cell">
                <img
                    src={rowData.company.picture}
                    alt={rowData.company.name}
                    className="company-logo"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder-shipping.png";
                    }}
                />
                <span>{rowData.company.name}</span>
            </div>
        );
    };

    const priceTemplate = (rowData: IFreightResponse) => {
        const finalPrice = getDiscountedPrice(rowData.price, rowData.discount);

        return (
            <div className="price-cell">
                {rowData.discount > 0 && (
                    <span className="original-price">
                        {formatCurrency(rowData.price)}
                    </span>
                )}
                <span
                    className={rowData.discount > 0 ? "discounted-price" : ""}
                >
                    R$ {formatCurrency(finalPrice)}
                </span>
                {rowData.discount > 0 && (
                    <span className="discount-badge">-{rowData.discount}%</span>
                )}
            </div>
        );
    };

    const deliveryTemplate = (rowData: IFreightResponse) => {
        return (
            <span className="delivery-badge">
                {rowData.delivery_time} dia
                {rowData.delivery_time > 1 ? "s" : ""}
            </span>
        );
    };

    const { freight, onSetFreight } = use(CartContext);

    return (
        <div className="freight-list-container">
            
            <DataTable
                value={freights}
                emptyMessage="Nenhuma opção de frete disponível"
                selectionMode="single" selection={freight} onSelectionChange={(e) => onSetFreight(e.value)} dataKey="id" metaKeySelection={false}
            >
                <Column
                    header="Transportadora"
                    body={companyTemplate}
                    style={{ width: "30%" }}
                />
                <Column
                    field="name"
                    header="Serviço"
                    style={{ width: "25%" }}
                />
                <Column
                    header="Prazo"
                    body={deliveryTemplate}
                    style={{ width: "20%" }}
                    alignHeader="center"
                    align="center"
                />
                <Column
                    header="Valor"
                    body={priceTemplate}
                    style={{ width: "20%" }}
                    alignHeader="right"
                    align="right"
                />
            </DataTable>
        </div>
    );
};
