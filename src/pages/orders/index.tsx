import type { IOrderResponse } from "@/commons/types/types";
import { OrdersList } from "@/components/OrdersList";
import { getAllOrdersPageable } from "@/services/order-service";
import type React from "react";
import { useEffect, useState } from "react";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(4);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await getAllOrdersPageable(page, size);
      if (response) {
        setOrders(response.content);
        setTotalElements(response.totalElements);
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
    fetchOrders(0, rows);
  }, [rows]);

  const handlePageChange = (e: any) => {
    const newFirst = e.first;
    const newRows = e.rows;
    setFirst(newFirst);
    setRows(newRows);
    
    const pageIndex = Math.floor(newFirst / newRows);
    fetchOrders(pageIndex, newRows);
  };

  return (
    <div className="orders-page">
      {error && <div className="orders-page error">{error}</div>}

      {loading ? (
        <div className="orders-page">Carregando pedidos...</div>
      ) : totalElements > 0 ? (
        <>
          <OrdersList
            orders={orders}
            totalElements={totalElements}
            first={first}
            rows={rows}
            onPageChange={handlePageChange}
          />
      </>
      ) : (
        <div className="orders-page">Nenhum pedido encontrado.</div>
      )}

      
    </div>
  );
};

export default OrdersPage;
