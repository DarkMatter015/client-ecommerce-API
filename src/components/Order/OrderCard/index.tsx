import type { IItem, IOrderResponse } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import type React from "react";
import { OrderItemList } from "../OrderItemList";

import "./order-card.style.css";

// Mapa de cores e ícones para cada status
const getStatusConfig = (status: string | undefined) => {
    const statusMap: Record<
        string,
        {
            color: string;
            backgroundColor: string;
            icon: string;
            textColor: string;
        }
    > = {
        ENTREGUE: {
            color: "#28a745",
            backgroundColor: "#d4edda",
            icon: "pi-check-circle",
            textColor: "#155724",
        },
        ENVIADO: {
            color: "#0dcaf0",
            backgroundColor: "#cfe2ff",
            icon: "pi-truck",
            textColor: "#084298",
        },
        PROCESSANDO: {
            color: "#ffc107",
            backgroundColor: "#fff3cd",
            icon: "pi-hourglass",
            textColor: "#664d03",
        },
        PENDENTE: {
            color: "#6c757d",
            backgroundColor: "#e2e3e5",
            icon: "pi-clock",
            textColor: "#41464b",
        },
        CANCELADO: {
            color: "#dc3545",
            backgroundColor: "#f8d7da",
            icon: "pi-times-circle",
            textColor: "#842029",
        },
    };

    return statusMap[status || "PENDENTE"] || statusMap["PENDENTE"];
};

export const OrderCard: React.FC<{
    order: IOrderResponse;
    totalItems: number;
    totalValue: number;
    isExpanded: boolean;
    toggleRowExpansion: (orderId: number) => void;
}> = ({ order, totalItems, totalValue, isExpanded, toggleRowExpansion }) => {
    const statusConfig = getStatusConfig(order.status);
    return (
        <div key={order.id} className="order-card">
            <div className="order-card-header">
                <div className="order-card-info">
                    <h3>Pedido #{order.id}</h3>
                    <div className="order-card-meta">
                        <span className="order-items">{totalItems} itens</span>
                        <span className="order-total">
                            R$ {formatCurrency(totalValue)}
                        </span>
                        <span className="order-payment">
                            Pagamento: {order.payment.name}
                        </span>
                        <span
                            className="order-status"
                            style={{
                                backgroundColor: statusConfig.backgroundColor,
                                color: statusConfig.textColor,
                                padding: "0.5rem 0.75rem",
                                borderRadius: "6px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                border: `2px solid ${statusConfig.color}`,
                            }}
                        >
                            <i className={`pi ${statusConfig.icon}`}></i>
                            {order.status}
                        </span>
                    </div>
                    <div className="order-card-address-summary">
                        <i className="pi pi-map-marker"></i>
                        {order.address.street}, {order.address.number} -{" "}
                        {order.address.city}
                    </div>
                </div>
                <Button
                    icon={
                        isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"
                    }
                    className="p-button-text p-button-rounded"
                    onClick={() => toggleRowExpansion(order.id!)}
                    aria-label={
                        isExpanded ? "Recolher detalhes" : "Expandir detalhes"
                    }
                />
            </div>

            {isExpanded && (
                <div className="order-card-details">
                    <Panel
                        header="Itens do Pedido"
                        className="order-items-panel"
                    >
                        <div className="order-items-grid">
                            {order.orderItems.map(
                                (item: IItem, index: number) => (
                                    <OrderItemList
                                        key={index}
                                        item={item}
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                    </Panel>

                    <Panel
                        header="Endereço de Entrega"
                        className="order-address-panel"
                    >
                        <div className="address-details">
                            <div className="address-line">
                                <strong>
                                    {order.address.street},{" "}
                                    {order.address.number}
                                </strong>
                                {order.address.complement && (
                                    <span> - {order.address.complement}</span>
                                )}
                            </div>
                            <div className="address-line">
                                {order.address.neighborhood},{" "}
                                {order.address.city} - {order.address.state}
                            </div>
                            <div className="address-line">
                                <strong>CEP:</strong> {order.address.cep}
                            </div>
                        </div>
                    </Panel>

                    <Panel header="Frete" className="order-freight-panel">
                        <div className="freight-details">
                            <div className="freight-company">
                                {order.shipment.company.picture && (
                                    <img
                                        src={order.shipment.company.picture}
                                        alt={order.shipment.company.name}
                                        className="freight-company-logo"
                                    />
                                )}
                                <strong>{order.shipment.company.name}</strong>
                            </div>
                            <div className="freight-line">
                                <strong>Transportadora:</strong>{" "}
                                {order.shipment.name}
                            </div>
                            <div className="freight-line">
                                <strong>Preço:</strong> R${" "}
                                {formatCurrency(order.shipment.price)}
                            </div>
                            {order.shipment.discount > 0 && (
                                <div className="freight-line freight-discount">
                                    <strong>Desconto:</strong> -R${" "}
                                    {formatCurrency(order.shipment.discount)}
                                </div>
                            )}
                            <div className="freight-line">
                                <strong>Prazo de Entrega:</strong>{" "}
                                {order.shipment.delivery_time} dias
                            </div>
                        </div>
                    </Panel>
                </div>
            )}
        </div>
    );
};
