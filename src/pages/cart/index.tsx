import React, { useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "./cart.style.css";
import type { IOrderItemResponse } from "@/commons/types/orderItem";

/* ===========================
   TYPES & INTERFACES
=========================== */

/* ===========================
   CONSTANTS & MOCK DATA
=========================== */

const SAMPLE_CART: IOrderItemResponse[] = [
  {
    id: 1,
    orderId: 1,
    product: {
      id: 1,
      name: "Guitarra sla",
      description: "ela toca ",
      price: 12,
      urlImage: "teste.png",
      category: {
        id: 1,
        name: "Guitarras",
      },
    },
    totalPrice: 1200,
    quantity: 10,
  },
  {
    id: 2,
    orderId: 1,
    product: {
      id: 2,
      name: "Violão Caipira",
      description: "Viola",
      price: 500,
      urlImage: "teste2.png",
      category: {
        id: 2,
        name: "Violões",
      },
    },
    totalPrice: 1000,
    quantity: 2,
  },
];

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

/* ===========================
   UTILITY FUNCTIONS
=========================== */
const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getItemCountText = (count: number): string => {
  return count === 1 ? "1 item" : `${count} itens`;
};

/* ===========================
   MAIN COMPONENT
=========================== */
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // State
  const [cart, setCart] = useState<IOrderItemResponse[]>(SAMPLE_CART);

  // Computed values (memoized for performance)
  const cartMetrics = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0
    );
    // TODO: ADICIONAR CAMPO DE CEP PARA CALCULAR FRETE COM OS PRODUTOS DO CARRINHO
    // const frete = address ? SHIPPING_COST : 0;
    // const total = subtotal - descontos + frete;

    // return { totalItems, subtotal, descontos, frete, total };
    return { totalItems, total };
  }, [cart]);

  /* ===========================
     TOAST HELPER
  =========================== */
  const showToast = useCallback((type: keyof typeof TOAST_MESSAGES) => {
    toast.current?.show(TOAST_MESSAGES[type]);
  }, []);

  /* ===========================
     EVENT HANDLERS
  =========================== */
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number, itemName: string) => {
    confirmDialog({
      message: `Deseja realmente remover "${itemName}" do carrinho?`,
      header: "Confirmar Remoção",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim, Remover",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => {
        setCart((prev) => prev.filter((item) => item.id !== id));
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
    if (cart.length === 0) {
      showToast("emptyCart");
      return;
    }

    navigate("/finalizar", { state: { cart } });
  };

  /**
   * Componente para exibir um item individual do carrinho
   */
  const ItemCart: React.FC<{ item: IOrderItemResponse }> = ({ item }) => {
    return (
      <article key={item.id} className="cart-item">
        <button
          className="cart-item-image"
          onClick={() => handleProductClick(item.id)}
          aria-label={`Ver detalhes de ${item.product.name}`}
        >
          <img src={item.product.urlImage} alt={item.product.name} />
        </button>

        <div className="cart-item-details">
          <h3 className="cart-item-name">{item.product.name}</h3>
          <div className="cart-item-info">
            {item.product.category.name && (
              <span className="cart-item-meta">
                <strong>Categoria:</strong> {item.product.category.name}
              </span>
            )}
          </div>
          <div className="cart-item-price-unit">
            R$ {formatCurrency(item.product.price)}
            <span className="per-unit">por unidade</span>
          </div>
        </div>

        <div className="cart-item-actions">
          <div className="cart-item-price">
            <strong>R$ {formatCurrency(item.totalPrice)}</strong>
          </div>

          <div
            className="quantity-control"
            role="group"
            aria-label="Controle de quantidade"
          >
            <button
              className="quantity-btn"
              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Diminuir quantidade"
            >
              <i className="pi pi-minus" aria-hidden="true"></i>
            </button>
            <input
              type="number"
              className="quantity-input"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                handleUpdateQuantity(
                  item.id,
                  Math.max(1, Number(e.target.value) || 1)
                )
              }
              aria-label={`Quantidade de ${item.product.name}`}
            />
            <button
              className="quantity-btn"
              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Aumentar quantidade"
            >
              <i className="pi pi-plus" aria-hidden="true"></i>
            </button>
          </div>

          <button
            className="btn-remove"
            onClick={() => handleRemoveItem(item.id, item.product.name)}
            aria-label={`Remover ${item.product.name} do carrinho`}
          >
            <i className="pi pi-trash" aria-hidden="true"></i> Remover
          </button>
        </div>
      </article>
    );
  };

  /**
   * Componente para exibir o estado de carrinho vazio
   */
  const EmptyCart: React.FC<{ onContinueShopping: () => void }> = ({
    onContinueShopping,
  }) => (
    <div className="empty-cart" role="status">
      <i className="pi pi-shopping-cart empty-cart-icon" aria-hidden="true"></i>
      <p>Seu carrinho está vazio</p>
      <Button
        className="btn-default"
        onClick={onContinueShopping}
        aria-label="Ir para página de produtos"
      >
        <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
        Ir às Compras
      </Button>
    </div>
  );

  /**
   * Componente para o cabeçalho da seção de produtos do carrinho
   */
  const CartHeader: React.FC<{ totalItems: number }> = ({ totalItems }) => (
    <div className="cart-products-header">
      <h2>Meu Carrinho</h2>
      <span
        className="cart-count"
        aria-label={`Total de ${getItemCountText(totalItems)}`}
      >
        {getItemCountText(totalItems)}
      </span>
    </div>
  );

  /**
   * Componente para o resumo do carrinho e botão de finalização
   */
  const CartSummary: React.FC<{
    cartMetrics: { totalItems: number; total: number };
    onFinalize: () => void;
    cartLength: number;
  }> = ({ cartMetrics, onFinalize, cartLength }) => (
    <aside className="cart-summary" aria-label="Resumo da compra">
      <div className="summary-sticky">
        <section className="summary-card">
          <h3>Resumo da Compra</h3>
          <div className="summary-line">
            <span>Total ({getItemCountText(cartMetrics.totalItems)})</span>
            <span>R$ {formatCurrency(cartMetrics.total)}</span>
          </div>

          <div className="summary-line">
            <span>Frete</span>
            {/* <span>{cartMetrics.frete > 0 ? `R$ ${formatCurrency(cartMetrics.frete)}` : 'Calcular'}</span> */}
          </div>
          <div className="summary-divider" role="separator"></div>
          <div className="summary-total">
            <span>Total</span>
            <span className="total-value">
              R$ {formatCurrency(cartMetrics.total)}
            </span>
          </div>
        </section>

        <Button
          className="btn-default btn-finalize w-full"
          onClick={onFinalize}
          disabled={cartLength === 0}
          aria-label="Finalizar compra"
        >
          <i className="pi pi-check me-2" aria-hidden="true"></i>
          Finalizar Compra
        </Button>
      </div>
    </aside>
  );

  /* ===========================
      RENDER
   =========================== */
  return (
    <div className="cart-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="cart-container">
        {/* Products Section */}
        <section className="cart-products" aria-label="Produtos no carrinho">
          <CartHeader totalItems={cartMetrics.totalItems} />

          {cart.length === 0 ? (
            <EmptyCart onContinueShopping={handleContinueShopping} />
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <ItemCart key={item.id} item={item} />
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

        {/* Summary Section */}
        <CartSummary
          cartMetrics={cartMetrics}
          onFinalize={handleFinalize}
          cartLength={cart.length}
        />
      </div>
    </div>
  );
};

export default CartPage;
