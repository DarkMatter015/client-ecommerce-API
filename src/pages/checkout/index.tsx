import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import './checkout.style.css';
import { getAllPaymentsPageable } from '@/services/payment-service';
import type { IAddress, IPayment } from '@/commons/types/types';
import { CartContext } from '@/context/CartContext';
import { getAllAddressesPageable } from '@/services/address-service';
import { CheckoutSummary } from '@/components/CheckoutSummary';
import { CheckoutPaymentMethod } from '@/components/CheckoutPaymentMethod';
import { AddressList } from '@/components/AddressList';
import { api } from '@/lib/axios';


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


const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const getItemCountText = (count: number): string => {
  return count === 1 ? '1 item' : `${count} itens`;
};

const CheckoutPage: React.FC = () => {

  const { cartItems, cartMetrics  } = use(CartContext);

  const [payments, setPayments] = useState<IPayment[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<null>(null);

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {

      if (!cartItems || cartItems.length === 0) {
        navigate('/carrinho');
        return;
      }

      const fetchPayments = async () => {
          try {
              const response = await getAllPaymentsPageable(0, 10);
              setPayments(response.content);
          } catch (err) {
              console.error('Erro ao buscar pagamentos:', err);
          }
      };
      
      const fetchAddress = async () => {
          try {
              const response = await getAllAddressesPageable(0, 10);
              setAddresses(response.content);
          } catch (err) {
              console.error('Erro ao buscar endereços:', err);
          }
      };

      fetchPayments();
      fetchAddress();
  }, [cartItems, navigate]);

  
  const showToast = useCallback((type: keyof typeof TOAST_MESSAGES) => {
      toast.current?.show(TOAST_MESSAGES[type]);
    }, []);

  const handlePlaceOrder = async () => {
    // TODO: API call to the backend to place the order
    try {
    const response = await api.post("/orders", {
      orderItems: cartItems?.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      address: selectedAddress,
      paymentId: paymentMethod?.id,
    });

    if (response.status !== 201) {
      throw new Error("Erro ao realizar o pedido")
    }

    console.log('Pedido realizado:', { cartItems, selectedAddress, paymentMethod });
    localStorage.removeItem("cartItems");

    toast.current?.show({
      severity: 'success',
      summary: 'Pedido Confirmado!',
      detail: 'Seu pedido foi realizado com sucesso e em breve será enviado.',
      life: 4000,
    });
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
    }

    // Redirect to an order confirmation/thank you page after a delay
    setTimeout(() => {
      // navigate('/meus-pedidos');
    }, 4000);
  };

  const handleGoBack = () => {
    navigate('/carrinho');
  };
  
    const handleFinalize = () => {
      if (!selectedAddress) {
        showToast('noAddress');
        return;
      }
      if (!paymentMethod) {
        showToast('noPayment');
        return;
      }

      handlePlaceOrder();
    };

  return (
    <div className="checkout-page">
      <Toast ref={toast} />
      <div className="checkout-container">
        <div className="checkout-details">
          {/* Step 1: Order Items */}
          <section className="checkout-card" aria-labelledby="order-items-heading">
            <h3 id="order-items-heading">
              <i className="pi pi-shopping-cart" aria-hidden="true"></i>
              Revise seus Itens
            </h3>
            <div className="order-item-list">
              {cartItems.map((item) => (
                <article key={item.id} className="order-item" aria-label={item.product.name}>
                  <div className="order-item-image">
                    <img src={item.product.urlImage} alt={item.product.urlImage} />
                  </div>
                  <div className="order-item-details">
                    <h4 className="order-item-name">{item.product.name}</h4>
                    <p className="order-item-meta">{item.product.category.name}</p>
                    <p className="order-item-quantity">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="p-grid" style={{ gap: '1.5rem' }}>
            <div className="p-col-12 p-md-6">
                <AddressList
                  addresses={addresses}
                  onSelectAddress={setSelectedAddress}
                  selectedAddress={selectedAddress}
                />
            </div>
            <div className="p-col-12 p-md-6">
                <CheckoutPaymentMethod 
                  payments={payments} 
                  paymentMethod={paymentMethod} 
                  setPaymentMethod={setPaymentMethod}
                />
            </div>
          </div>
        </div>

        <CheckoutSummary 
          cartMetrics={cartMetrics} 
          getItemCountText={getItemCountText} 
          formatCurrency={formatCurrency} 
          handlePlaceOrder={handleFinalize} 
          handleGoBack={handleGoBack} 
          selectedAddress={selectedAddress} 
          paymentMethod={paymentMethod}
        />
        
      </div>      
    </div>
  );
};

export default CheckoutPage;
