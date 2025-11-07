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
import { ItemCartCheckout } from '@/components/ItemCartCheckout';


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


const CheckoutPage: React.FC = () => {

  const { cartItems, cartMetrics, cleanCart } = use(CartContext);

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
      
      toast.current?.show({
        severity: 'success',
        summary: 'Pedido Confirmado!',
        detail: 'Seu pedido foi realizado com sucesso e em breve será enviado.',
        life: 4000,
      });

      setTimeout(() => {
        cleanCart();
        navigate("/pedidos")
      }, 4000);
      
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
    }
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
                <ItemCartCheckout
                  key={item.id}
                  item={item}
                />
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
