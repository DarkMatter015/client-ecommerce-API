import type { IItem, IOrderResponse } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import type React from "react";
import { OrderItemList } from "../OrderItemList";

import "./order-card.style.css";


export const OrderCard: React.FC<{
  order: IOrderResponse;
  totalItems: number;
  totalValue: number;
  isExpanded: boolean;
  toggleRowExpansion: (orderId: number) => void;
}> = ({ order, totalItems, totalValue, isExpanded, toggleRowExpansion }) => {
  return (
    <div key={order.id} className="order-card">
      <div className="order-card-header">
        <div className="order-card-info">
          <h3>Pedido #{order.id}</h3>
          <div className="order-card-meta">
            <span className="order-items">{totalItems} itens</span>
            <span className="order-total">R$ {formatCurrency(totalValue)}</span>
            <span className="order-payment">
              Pagamento: {order.payment.name}
            </span>
          </div>
          <div className="order-card-address-summary">
            <i className="pi pi-map-marker"></i>
            {order.address.street}, {order.address.number} -{" "}
            {order.address.city}
          </div>
        </div>
        <Button
          icon={isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
          className="p-button-text p-button-rounded"
          onClick={() => toggleRowExpansion(order.id!)}
          aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
        />
      </div>

      {isExpanded && (
        <div className="order-card-details">
          <Panel header="Itens do Pedido" className="order-items-panel">
            <div className="order-items-grid">
              {order.orderItems.map((item: IItem, index: number) => (
                <OrderItemList key={index} item={item} index={index} />
              ))}
            </div>
          </Panel>

          <Panel header="Endereço de Entrega" className="order-address-panel">
            <div className="address-details">
              <div className="address-line">
                <strong>
                  {order.address.street}, {order.address.number}
                </strong>
                {order.address.complement && (
                  <span> - {order.address.complement}</span>
                )}
              </div>
              <div className="address-line">
                {order.address.neighborhood}, {order.address.city} -{" "}
                {order.address.state}
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
                <strong>Transportadora:</strong> {order.shipment.name}
              </div>
              <div className="freight-line">
                <strong>Preço:</strong> R$ {formatCurrency(order.shipment.price)}
              </div>
              {order.shipment.discount > 0 && (
                <div className="freight-line freight-discount">
                  <strong>Desconto:</strong> -R$ {formatCurrency(order.shipment.discount)}
                </div>
              )}
              <div className="freight-line">
                <strong>Prazo de Entrega:</strong> {order.shipment.delivery_time} dias
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
};
