import React, { useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import type { IItem, IOrderResponse } from '@/commons/types/types';
import './orders-list.style.css';
import { formatCurrency } from '@/utils/Utils';

interface OrdersListProps {
    orders: IOrderResponse[];
    totalElements: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ 
    orders, 
    totalElements, 
    currentPage, 
    pageSize, 
    onPageChange 
}) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRowExpansion = (orderId: number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(orderId)) {
            newExpandedRows.delete(orderId);
        } else {
            newExpandedRows.add(orderId);
        }
        setExpandedRows(newExpandedRows);
    };

    const itemTemplate = (order: IOrderResponse) => {
        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = order.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const isExpanded = expandedRows.has(order.id!);

        return (
            <div className="order-card">
                <div className="order-header">
                    <div className="order-info">
                        <h3>Pedido #{order.id}</h3>
                        <div className="order-meta">
                            <span className="order-items">{totalItems} itens</span>
                            <span className="order-total">{formatCurrency(totalValue)}</span>
                            <span className="order-payment">Pagamento: {order.payment.name}</span>
                        </div>
                        <div className="order-address-summary">
                            <i className="pi pi-map-marker"></i>
                            {order.address.street}, {order.address.number} - {order.address.city}
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
                    <div className="order-details">
                        <Panel header="Itens do Pedido" className="order-items-panel">
                            <div className="order-items-grid">
                                {order.orderItems.map((item: IItem, index: number) => (
                                    <div key={index} className="order-item-detail">
                                        <div className="item-image">
                                            <img
                                                src={item.product.urlImage}
                                                alt={item.product.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="item-info">
                                            <h4>{item.product.name}</h4>
                                            <p className="item-description">{item.product.description}</p>
                                            <div className="item-meta">
                                                <span className="item-category">
                                                    <i className="pi pi-tag"></i>
                                                    {item.product.category.name}
                                                </span>
                                                <span className="item-quantity">
                                                    <i className="pi pi-shopping-cart"></i>
                                                    Qtd: {item.quantity}
                                                </span>
                                                <span className="item-price">
                                                    {formatCurrency(item.product.price)} cada
                                                </span>
                                            </div>
                                            <div className="item-total">
                                                Total: {formatCurrency(item.totalPrice || 0)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel header="Endereço de Entrega" className="order-address-panel">
                            <div className="address-details">
                                <div className="address-line">
                                    <strong>{order.address.street}, {order.address.number}</strong>
                                    {order.address.complement && <span> - {order.address.complement}</span>}
                                </div>
                                <div className="address-line">
                                    {order.address.neighborhood}, {order.address.city} - {order.address.state}
                                </div>
                                <div className="address-line">
                                    <strong>CEP:</strong> {order.address.cep}
                                </div>
                            </div>
                        </Panel>
                    </div>
                )}
            </div>
        );
    };

    const handlePageChange = (event: any) => {
        onPageChange(event.page, event.rows);
    };

    return (
        <div className="orders-list-container">
            <h2>Meus Pedidos</h2>
            {totalElements === 0 ? (
                <div className="no-orders">
                    <i className="pi pi-shopping-cart"></i>
                    <p>Nenhum pedido encontrado.</p>
                </div>
            ) : (
                <DataView
                    value={orders}
                    itemTemplate={itemTemplate}
                    paginator
                    rows={pageSize}
                    first={currentPage * pageSize}
                    totalRecords={totalElements}
                    onPage={handlePageChange}
                    emptyMessage="Nenhum pedido encontrado"
                    className="orders-dataview"
                />
            )}
        </div>
    );
};
