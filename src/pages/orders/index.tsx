import type { IOrderResponse } from "@/commons/types/types";
import { OrdersList } from "@/components/OrdersList";
import { getAllOrdersPageable } from "@/services/order-service";
import type React from "react";
import { useEffect, useState } from "react";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await getAllOrdersPageable(page, size);
      if (response) {
        setOrders(response.content);
        setTotalElements(response.totalElements);
        setCurrentPage(page);
        setPageSize(size);
      }
    } catch (err) {
      setError(
        "Erro ao carregar pedidos. Por favor, tente novamente mais tarde."
      );
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0, 10);
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    fetchOrders(page, pageSize);
  };

  if (loading) {
    return <div className="orders-page">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="orders-page error">{error}</div>;
  }

  return (
    <div className="orders-page">
      <OrdersList
        orders={orders}
        totalElements={totalElements}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrdersPage;
