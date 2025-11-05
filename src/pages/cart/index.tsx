import React, { useRef, useCallback, use } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import type { IItem } from "@/commons/types/types";
import { CartContext } from "@/context/CartContext";

import "./cart.style.css";

import { CartSummary } from "@/components/CartSummary";
import { CartHeader } from "@/components/CartHeader";
import { EmptyCart } from "@/components/EmptyCart";
import { ItemCart } from "@/components/ItemCart";



const TOAST_MESSAGES = {
  emptyCart: {
    severity: "warn" as const,
    summary: "Carrinho Vazio",
    detail: "Seu carrinho está vazio. Adicione produtos para continuar.",
    life: 3000,
  },
  noAddress: {
    severity: "warn" as const,
    summary: "Endereço Necessário",
    detail: "Por favor, adicione um endereço de entrega.",
    life: 3000,
  },
  noPayment: {
    severity: "warn" as const,
    summary: "Método de Pagamento",
    detail: "Por favor, selecione um método de pagamento.",
    life: 3000,
  },
  orderSuccess: {
    severity: "success" as const,
    summary: "Compra Finalizada",
    detail: "Seu pedido foi realizado com sucesso!",
    life: 4000,
  },
  addressDeleted: {
    severity: "info" as const,
    summary: "Endereço Removido",
    detail: "O endereço foi removido com sucesso.",
    life: 3000,
  },
  addressSaved: {
    severity: "success" as const,
    summary: "Endereço Salvo",
    detail: "Endereço salvo com sucesso!",
    life: 3000,
  },
  itemRemoved: {
    severity: "info" as const,
    summary: "Produto Removido",
    detail: "O produto foi removido do carrinho.",
    life: 3000,
  },
} as const;


const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const { cartItems, cartMetrics, deleteItem, handleUpdateQuantity } = use(CartContext);


  const showToast = useCallback((type: keyof typeof TOAST_MESSAGES) => {
    toast.current?.show(TOAST_MESSAGES[type]);
  }, []);


  const handleRemoveItem = (item: IItem) => {
    confirmDialog({
      message: `Deseja realmente remover "${item.product.name}" do carrinho?`,
      header: "Confirmar Remoção",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim, Remover",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteItem(item);
        showToast("itemRemoved");
      },
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/produto/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleFinalize = () => {
    if (!cartItems || cartItems.length === 0) {
      showToast("emptyCart");
      return;
    }

    navigate("/finalizar", { state: { cartItems } });
  };


  return (
    <div className="cart-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="cart-container">
        <section className="cart-products" aria-label="Produtos no carrinho">
          <CartHeader totalItems={cartMetrics ? cartMetrics.totalItems : 0} />

          {cartItems.length === 0 ? (
            <EmptyCart
              onContinueShopping={handleContinueShopping}
            />
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <ItemCart
                    key={item.id}
                    item={item}
                    handleProductClick={handleProductClick}
                    handleRemoveItem={handleRemoveItem}
                    handleUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>

              <Button
                className="btn-gray btn-continue-shopping"
                onClick={handleContinueShopping}
              >
                <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
                Continuar Comprando
              </Button>
            </>
          )}
        </section>

        <CartSummary
          cartLength={cartItems?.length || 0}
          cartMetrics={cartMetrics || { totalItems: 0, total: 0 }}
          onFinalize={handleFinalize}
        />
      </div>
    </div>
  );
};

export default CartPage;
