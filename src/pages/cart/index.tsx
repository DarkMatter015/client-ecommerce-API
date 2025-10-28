import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './cart.style.css';

/* ===========================
   TYPES & INTERFACES
=========================== */
type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  marca?: string;
  categoria?: string;
};


type PaymentMethod = 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Boleto Bancário' | '';

/* ===========================
   CONSTANTS & MOCK DATA
=========================== */


const SAMPLE_CART: CartItem[] = [
  { 
    id: 1, 
    nome: 'Guitarra Exemplo', 
    preco: 1999.99, 
    quantidade: 1, 
    imagem: '/assets/images/home/person1.jfif',
    marca: 'Fender',
    categoria: 'Guitarras'
  },
  { 
    id: 2, 
    nome: 'Violão Sample', 
    preco: 799.5, 
    quantidade: 2, 
    imagem: '/assets/images/home/person2.jfif',
    marca: 'Yamaha',
    categoria: 'Violões'
  }
];


const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
  { value: 'Cartão de Débito', label: 'Cartão de Débito' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Boleto Bancário', label: 'Boleto Bancário' }
];

const SHIPPING_COST = 15.0;

const TOAST_MESSAGES = {
  emptyCart: {
    severity: 'warn' as const,
    summary: 'Carrinho Vazio',
    detail: 'Seu carrinho está vazio. Adicione produtos para continuar.',
    life: 3000,
  },
  noAddress: {
    severity: 'warn' as const,
    summary: 'Endereço Necessário',
    detail: 'Por favor, adicione um endereço de entrega.',
    life: 3000,
  },
  noPayment: {
    severity: 'warn' as const,
    summary: 'Método de Pagamento',
    detail: 'Por favor, selecione um método de pagamento.',
    life: 3000,
  },
  orderSuccess: {
    severity: 'success' as const,
    summary: 'Compra Finalizada',
    detail: 'Seu pedido foi realizado com sucesso!',
    life: 4000,
  },
  addressDeleted: {
    severity: 'info' as const,
    summary: 'Endereço Removido',
    detail: 'O endereço foi removido com sucesso.',
    life: 3000,
  },
  addressSaved: {
    severity: 'success' as const,
    summary: 'Endereço Salvo',
    detail: 'Endereço salvo com sucesso!',
    life: 3000,
  },
  itemRemoved: {
    severity: 'info' as const,
    summary: 'Produto Removido',
    detail: 'O produto foi removido do carrinho.',
    life: 3000,
  },
} as const;

/* ===========================
   UTILITY FUNCTIONS
=========================== */
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const getItemCountText = (count: number): string => {
  return count === 1 ? '1 item' : `${count} itens`;
};

/* ===========================
   MAIN COMPONENT
=========================== */
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  // State
  const [cart, setCart] = useState<CartItem[]>(SAMPLE_CART);
  

  // Computed values (memoized for performance)
  const cartMetrics = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    const descontos = 0;
    // TODO: ADICIONAR CAMPO DE CEP PARA CALCULAR FRETE COM OS PRODUTOS DO CARRINHO
    // const frete = address ? SHIPPING_COST : 0;
    // const total = subtotal - descontos + frete;
    const total = subtotal - descontos;

    // return { totalItems, subtotal, descontos, frete, total };
    return { totalItems, subtotal, descontos, total };
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
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id: number, itemName: string) => {
    confirmDialog({
      message: `Deseja realmente remover "${itemName}" do carrinho?`,
      header: 'Confirmar Remoção',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Remover',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => {
        setCart(prev => prev.filter(item => item.id !== id));
        showToast('itemRemoved');
      },
    });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/produto/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleFinalize = () => {
      if (cart.length === 0) {
        showToast('emptyCart');
        return;
      }
      // if (!address) {
      //   showToast('noAddress');
      //   return;
      // }
      // if (!paymentMethod) {
      //   showToast('noPayment');
      //   return;
      // }
      
      navigate('/finalizar', { state: { cart } });
      
  
    };

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
          <div className="cart-products-header">
            <h2>Meu Carrinho</h2>
            <span className="cart-count" aria-label={`Total de ${getItemCountText(cartMetrics.totalItems)}`}>
              {getItemCountText(cartMetrics.totalItems)}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart" role="status">
              <i className="pi pi-shopping-cart empty-cart-icon" aria-hidden="true"></i>
              <p>Seu carrinho está vazio</p>
              <Button 
                className="btn-default" 
                onClick={handleContinueShopping}
                aria-label="Ir para página de produtos"
              >
                <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
                Ir às Compras
              </Button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <article key={item.id} className="cart-item">
                    <button 
                      className="cart-item-image" 
                      onClick={() => handleProductClick(item.id)}
                      aria-label={`Ver detalhes de ${item.nome}`}
                    >
                      <img src={item.imagem} alt={item.nome} />
                    </button>

                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.nome}</h3>
                      <div className="cart-item-info">
                        {item.marca && (
                          <span className="cart-item-meta">
                            <strong>Marca:</strong> {item.marca}
                          </span>
                        )}
                        {item.categoria && (
                          <span className="cart-item-meta">
                            <strong>Categoria:</strong> {item.categoria}
                          </span>
                        )}
                      </div>
                      <div className="cart-item-price-unit">
                        R$ {formatCurrency(item.preco)} 
                        <span className="per-unit">por unidade</span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-item-price">
                        <strong>R$ {formatCurrency(item.preco * item.quantidade)}</strong>
                      </div>
                      
                      <div className="quantity-control" role="group" aria-label="Controle de quantidade">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                          disabled={item.quantidade <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          <i className="pi pi-minus" aria-hidden="true"></i>
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantidade}
                          min={1}
                          onChange={(e) => handleUpdateQuantity(item.id, Math.max(1, Number(e.target.value) || 1))}
                          aria-label={`Quantidade de ${item.nome}`}
                        />
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          <i className="pi pi-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                      
                      <button 
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item.id, item.nome)}
                      aria-label={`Remover ${item.nome} do carrinho`}
                      >
                      <i className="pi pi-trash" aria-hidden="true"></i> Remover
                      </button>
                    </div>
                  </article>
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
        <aside className="cart-summary" aria-label="Resumo da compra">
          <div className="summary-sticky">
            {/* Order Summary */}
            <section className="summary-card">
              <h3>Resumo da Compra</h3>
              <div className="summary-line">
                <span>Subtotal ({getItemCountText(cartMetrics.totalItems)})</span>
                <span>R$ {formatCurrency(cartMetrics.subtotal)}</span>
              </div>
              {cartMetrics.descontos > 0 && (
                <div className="summary-line discount">
                  <span>Descontos</span>
                  <span>- R$ {formatCurrency(cartMetrics.descontos)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Frete</span>
                {/* <span>{cartMetrics.frete > 0 ? `R$ ${formatCurrency(cartMetrics.frete)}` : 'Calcular'}</span> */}
              </div>
              <div className="summary-divider" role="separator"></div>
              <div className="summary-total">
                <span>Total</span>
                <span className="total-value">R$ {formatCurrency(cartMetrics.total)}</span>
              </div>
            </section>

            {/* Checkout Button */}
            <Button 
              className="btn-default btn-finalize w-full" 
              onClick={handleFinalize}
              disabled={cart.length === 0}
              aria-label="Finalizar compra"
            >
              <i className="pi pi-check me-2" aria-hidden="true"></i>
              Finalizar Compra
            </Button>
          </div>
        </aside>
      </div>

      
    </div>
  );
};

export default CartPage;
