import React, { useState } from 'react';
import { Paginator } from 'primereact/paginator';
import type { IOrderResponse } from '@/commons/types/types';
import './orders-list.style.css';
import { OrderCard } from '../OrderCard';

interface OrdersListProps {
    orders: IOrderResponse[];
    totalElements: number;
    first: number;
    rows: number;
    onPageChange: (event: any) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({ 
    orders, 
    totalElements, 
    first,
    rows,
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

    const renderOrderCard = (order: IOrderResponse) => {
        const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = order.orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const isExpanded = expandedRows.has(order.id!);

        return (
            <OrderCard isExpanded={isExpanded}
                key={order.id}
                order={order}
                totalItems={totalItems}
                totalValue={totalValue}
                toggleRowExpansion={toggleRowExpansion}
            />
        );
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
                <>
                    <div className="orders-grid">
                        {orders.map((order) => renderOrderCard(order))}
                    </div>
                    <div className="paginator-container">
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={totalElements}
                            rowsPerPageOptions={[4, 8, 12, 16]}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        />
                    </div>
                </>
            )}
        </div>
    );
};
