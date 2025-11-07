import type { IOrderRequest, IOrderResponse, IPayment } from "@/commons/types/types";
import { OrdersList } from "@/components/OrdersList";
import { getAllOrdersPageable } from "@/services/order-service";
import { getAllPaymentsPageable } from "@/services/payment-service";
import type React from "react";
import { useEffect, useState } from "react";

const OrdersPage: React.FC = () => {

    const [orders, setOrders] = useState<IOrderResponse[]>([]);
    const [payments, setPayments] = useState<IPayment[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrdersPageable(0, 10);
                if (response) {
                    setOrders(response.content);
                }
            } catch (err) {
                setError('Erro ao carregar pedidos. Por favor, tente novamente mais tarde.');
                console.error('Erro ao buscar pedidos:', err);
            } finally {
                setLoading(false);
            }
        };
        
        const fetchPayments = async () => {
            try {
                const response = await getAllPaymentsPageable(0, 10);
                if (response) {
                    setPayments(response.content);
                }
            } catch (err) {
                setError('Erro ao carregar pagamentos. Por favor, tente novamente mais tarde.');
                console.error('Erro ao buscar pagamentos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        fetchPayments();
    }, [])


    

    return (
        <div className="orders-page">
            <OrdersList orders={orders} />

        </div>
    );
};

export default OrdersPage;