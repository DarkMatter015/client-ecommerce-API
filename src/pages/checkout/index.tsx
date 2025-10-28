import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './checkout.style.css';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';

// Helper Types from Cart - in a real app, these would be in a shared types file
type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  marca?: string;
  categoria?: string;
};

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

type Address = {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

type AddressFormErrors = {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
};

type PaymentMethod = 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Boleto Bancário' | '';


const INITIAL_ADDRESS: Address = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  cep: ''
};


const SAMPLE_ADDRESSES: Address[] = [
  {
    id: 1,
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    cep: '01234567'
  },
  {
    id: 2,
    street: 'Avenida Paulista',
    number: '1000',
    complement: '',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310100'
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

// Helper Functions - also could be shared
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const getItemCountText = (count: number): string => {
  return count === 1 ? '1 item' : `${count} itens`;
};

const formatAddress = (address: Address | null): string => {
  if (!address) return 'Nenhum endereço selecionado';
  const complement = address.complement ? `, ${address.complement}` : '';
  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${formatCEP(address.cep)}`;
};


const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 5)}-${cleaned.substring(5)}`;
  }
  return cep;
};

const validateAddress = (address: Address): AddressFormErrors => {
  const errors: AddressFormErrors = {};

  // Street validation
  if (!address.street.trim()) {
    errors.street = 'Rua é obrigatória';
  } else if (address.street.length < 3) {
    errors.street = 'Rua deve ter no mínimo 3 caracteres';
  } else if (address.street.length > 255) {
    errors.street = 'Rua deve ter no máximo 255 caracteres';
  }

  // Number validation
  if (!address.number.trim()) {
    errors.number = 'Número é obrigatório';
  }

  // Neighborhood validation
  if (!address.neighborhood.trim()) {
    errors.neighborhood = 'Bairro é obrigatório';
  }

  // City validation
  if (!address.city.trim()) {
    errors.city = 'Cidade é obrigatória';
  } else if (address.city.length < 3) {
    errors.city = 'Cidade deve ter no mínimo 3 caracteres';
  } else if (address.city.length > 255) {
    errors.city = 'Cidade deve ter no máximo 255 caracteres';
  }

  // State validation
  if (!address.state.trim()) {
    errors.state = 'Estado é obrigatório';
  } else if (address.state.length !== 2) {
    errors.state = 'Estado deve ter 2 caracteres (UF)';
  }

  // CEP validation
  const cepDigits = address.cep.replace(/\D/g, '');
  if (!cepDigits) {
    errors.cep = 'CEP é obrigatório';
  } else if (cepDigits.length !== 8) {
    errors.cep = 'CEP deve conter 8 dígitos';
  } else if (!/^\d{8}$/.test(cepDigits)) {
    errors.cep = 'CEP deve conter apenas números';
  }

  return errors;
};

const CheckoutPage: React.FC = () => {

  const [cart, setCart] = useState<CartItem[]>(SAMPLE_CART);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');

  const [address, setAddress] = useState<Address | null>(SAMPLE_ADDRESSES[0]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address>(INITIAL_ADDRESS);
  const [formErrors, setFormErrors] = useState<AddressFormErrors>({});

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const showToast = useCallback((type: keyof typeof TOAST_MESSAGES) => {
      toast.current?.show(TOAST_MESSAGES[type]);
    }, []);

  // Get state from navigation, if not present, redirect to cart
  if (!cart || cart.length === 0) {
    // In a real app, you might want to show a message before redirecting
    React.useEffect(() => {
      navigate('/carrinho');
    }, [navigate]);
    return null; // Render nothing while redirecting
  }

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

  

  const { subtotal, total, totalItems } = cartMetrics;

  const handlePlaceOrder = () => {
    // TODO: API call to the backend to place the order
    console.log('Pedido realizado:', { cart, address, paymentMethod, total });

    toast.current?.show({
      severity: 'success',
      summary: 'Pedido Confirmado!',
      detail: 'Seu pedido foi realizado com sucesso e em breve será enviado.',
      life: 4000,
    });

    // Redirect to an order confirmation/thank you page after a delay
    setTimeout(() => {
      navigate('/meus-pedidos'); // Assuming a future '/meus-pedidos' route
    }, 4000);
  };

  const handleGoBack = () => {
    navigate('/carrinho');
  };

  const handleOpenAddressDialog = () => {
      setIsAddingNew(false);
      setFormErrors({});
      setShowAddressDialog(true);
    };
  
    const handleAddNewAddress = () => {
      setIsAddingNew(true);
      setEditingAddress(INITIAL_ADDRESS);
      setFormErrors({});
    };
  
    const handleSelectAddress = (selectedAddress: Address) => {
      setAddress(selectedAddress);
      setShowAddressDialog(false);
    };
  
    const handleEditAddress = (addressToEdit: Address) => {
      setIsAddingNew(true);
      setEditingAddress(addressToEdit);
      setFormErrors({});
    };
  
    const handleSaveAddress = () => {
      const errors = validateAddress(editingAddress);
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
  
      if (editingAddress.id) {
        // Update existing address
        setSavedAddresses(prev => 
          prev.map(addr => addr.id === editingAddress.id ? editingAddress : addr)
        );
        setAddress(editingAddress);
      } else {
        // Add new address
        const newAddress = { ...editingAddress, id: Date.now() };
        setSavedAddresses(prev => [...prev, newAddress]);
        setAddress(newAddress);
      }
  
      showToast('addressSaved');
      setShowAddressDialog(false);
      setIsAddingNew(false);
      setFormErrors({});
    };
  
    const handleCancelAddressForm = () => {
      setIsAddingNew(false);
      setEditingAddress(INITIAL_ADDRESS);
      setFormErrors({});
    };
  
    const handleDeleteAddress = () => {
      confirmDialog({
        message: address ? `Deseja remover o endereço "${address.street}, ${address.number}"?` : 'Deseja remover o endereço selecionado?',
        header: 'Confirmar Remoção',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sim, Remover',
        rejectLabel: 'Cancelar',
        acceptClassName: 'p-button-danger',
        accept: () => {
          setAddress(null);
          showToast('addressDeleted');
        },
      });
    };
  
    const handleFinalize = () => {
      // if (cart.length === 0) {
      //   showToast('emptyCart');
      //   return;
      // }
      if (!address) {
        showToast('noAddress');
        return;
      }
      if (!paymentMethod) {
        showToast('noPayment');
        return;
      }
      
      
  
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
              {cart.map((item: CartItem) => (
                <article key={item.id} className="order-item" aria-label={item.nome}>
                  <div className="order-item-image">
                    <img src={item.imagem} alt={item.nome} />
                  </div>
                  <div className="order-item-details">
                    <h4 className="order-item-name">{item.nome}</h4>
                    <p className="order-item-meta">{item.marca}</p>
                    <p className="order-item-quantity">Quantidade: {item.quantidade}</p>
                  </div>
                  <div className="order-item-price">
                    <span>{formatCurrency(item.preco * item.quantidade)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Step 2: Shipping and Payment */}
          <div className="p-grid" style={{ gap: '1.5rem' }}>
            <div className="p-col-12 p-md-6">
              {/* <section className="checkout-card" aria-labelledby="shipping-heading">
                <h3 id="shipping-heading">
                  <i className="pi pi-map-marker" aria-hidden="true"></i>
                  Endereço de Entrega
                </h3>
                <div className="address-display">
                  {address ? (
                    <p>{formatAddress(address)}</p>
                  ) : (
                    <p>Endereço não fornecido.</p>
                  )}
                </div>
              </section> */}
              {/* Shipping Address */}
                          <section className="address-card">
                            <div className="address-header">
                              <h4>
                                <i className="pi pi-map-marker" aria-hidden="true"></i> Endereço de Entrega
                              </h4>
                              <div className="address-actions">
                                <button 
                                  className="icon-btn btn-edit" 
                                  onClick={handleOpenAddressDialog}
                                  aria-label="Gerenciar endereços"
                                >
                                  <i className="pi pi-pencil" aria-hidden="true"></i>
                                </button>
                                {address && (
                                  <button 
                                    className="icon-btn btn-delete" 
                                    onClick={handleDeleteAddress}
                                    aria-label="Remover endereço selecionado"
                                  >
                                    <i className="pi pi-trash" aria-hidden="true"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="address-content">
                              {address ? (
                                <p className="address-text">{formatAddress(address)}</p>
                              ) : (
                                <p className="no-address">Nenhum endereço selecionado</p>
                              )}
                            </div>
                          </section>
            </div>
            <div className="p-col-12 p-md-6">
              {/* <section className="checkout-card" aria-labelledby="payment-heading">
                <h3 id="payment-heading">
                  <i className="pi pi-credit-card" aria-hidden="true"></i>
                  Forma de Pagamento
                </h3>
                <div className="payment-display">
                  {paymentMethod ? (
                    <p>{paymentMethod}</p>
                  ) : (
                    <p>Forma de pagamento não selecionada.</p>
                  )}
                </div>
              </section> */}
              {/* Payment Method */}
            <section className="payment-card">
              <h4>
                <i className="pi pi-credit-card" aria-hidden="true"></i> Pagamento
              </h4>
              <select 
                className="payment-select" 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                aria-label="Selecione o método de pagamento"
              >
                <option value="" disabled>Selecione o método</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </section>
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <div className="summary-sticky">
            <section className="checkout-card" aria-labelledby="summary-heading">
              <h3 id="summary-heading">Resumo do Pedido</h3>
              <div className="summary-line">
                <span>Subtotal ({getItemCountText(totalItems)})</span>
                <span>R$ {formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Frete</span>
                {/* <span>R$ {formatCurrency(frete)}</span> */}
              </div>
              <div className="summary-divider" role="separator"></div>
              <div className="summary-total">
                <span>Total</span>
                <span className="total-value">R$ {formatCurrency(total)}</span>
              </div>
              <Button 
                className="btn-default btn-place-order w-full" 
                onClick={handlePlaceOrder}
                disabled={!address || !paymentMethod}
                aria-label="Confirmar e Pagar o pedido"
              >
                <i className="pi pi-check-circle me-2" aria-hidden="true"></i>
                Confirmar e Pagar
              </Button>
              <Button 
                className="btn-gray w-full mt-2" 
                onClick={handleGoBack}
                aria-label="Voltar para o carrinho"
              >
                <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
                Voltar para o Carrinho
              </Button>
            </section>
          </div>
        </aside>
      </div>
      {/* Address Dialog */}
      <Dialog
        header={isAddingNew ? (editingAddress.id ? "Editar Endereço" : "Novo Endereço") : "Meus Endereços"}
        visible={showAddressDialog}
        className="address-dialog"
        style={{ width: '90vw', maxWidth: '600px' }}
        onHide={() => {
          setShowAddressDialog(false);
          setIsAddingNew(false);
          setFormErrors({});
        }}
        footer={
          isAddingNew ? (
            <div className="dialog-footer">
              <Button 
                label="Cancelar" 
                className="btn-gray" 
                onClick={handleCancelAddressForm}
              />
              <Button 
                label="Salvar" 
                className="btn-default" 
                onClick={handleSaveAddress}
              />
            </div>
          ) : null
        }
      >
        {!isAddingNew ? (
          <div className="address-list-container">
            {/* Saved Addresses List */}
            <div className="saved-addresses-list">
              {savedAddresses.length === 0 ? (
                <div className="no-addresses">
                  <i className="pi pi-map-marker" aria-hidden="true"></i>
                  <p>Nenhum endereço cadastrado</p>
                </div>
              ) : (
                savedAddresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`address-list-item ${address?.id === addr.id ? 'selected' : ''}`}
                  >
                    <div className="address-list-item-content">
                      <div className="address-list-item-info">
                        <strong>{addr.street}, {addr.number}</strong>
                        {addr.complement && <span className="address-complement">{addr.complement}</span>}
                        <p className="address-details">
                          {addr.neighborhood}, {addr.city} - {addr.state}
                        </p>
                        <p className="address-cep">CEP: {formatCEP(addr.cep)}</p>
                      </div>
                      <div className="address-list-item-actions">
                        <button
                          className="btn-select-address"
                          onClick={() => handleSelectAddress(addr)}
                        >
                          {address?.id === addr.id ? (
                            <>
                              <i className="pi pi-check" aria-hidden="true"></i> Selecionado
                            </>
                          ) : (
                            'Selecionar'
                          )}
                        </button>
                        <button
                          className="btn-icon-small btn-edit-small"
                          onClick={() => handleEditAddress(addr)}
                          aria-label="Editar endereço"
                        >
                          <i className="pi pi-pencil" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Address Button */}
            <Button
              className="btn-add-new-address w-full"
              onClick={handleAddNewAddress}
            >
              <i className="pi pi-plus me-2" aria-hidden="true"></i>
              Adicionar Novo Endereço
            </Button>
          </div>
        ) : (
          <form className="address-form" onSubmit={(e) => { e.preventDefault(); handleSaveAddress(); }}>
            {/* CEP */}
            <div className="form-group">
              <label htmlFor="cep">CEP *</label>
              <InputText
                id="cep"
                value={editingAddress.cep}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').substring(0, 8);
                  setEditingAddress({ ...editingAddress, cep: value });
                  if (formErrors.cep) {
                    setFormErrors({ ...formErrors, cep: undefined });
                  }
                }}
                placeholder="00000000"
                className={formErrors.cep ? 'p-invalid' : ''}
                maxLength={8}
              />
              {formErrors.cep && <small className="p-error">{formErrors.cep}</small>}
            </div>

            {/* Street */}
            <div className="form-group">
              <label htmlFor="street">Rua *</label>
              <InputText
                id="street"
                value={editingAddress.street}
                onChange={(e) => {
                  setEditingAddress({ ...editingAddress, street: e.target.value });
                  if (formErrors.street) {
                    setFormErrors({ ...formErrors, street: undefined });
                  }
                }}
                placeholder="Nome da rua"
                className={formErrors.street ? 'p-invalid' : ''}
                maxLength={255}
              />
              {formErrors.street && <small className="p-error">{formErrors.street}</small>}
            </div>

            {/* Number and Complement */}
            <div className="form-row form-row-2col">
              <div className="form-group">
                <label htmlFor="number">Número *</label>
                <InputText
                  id="number"
                  value={editingAddress.number}
                  onChange={(e) => {
                    setEditingAddress({ ...editingAddress, number: e.target.value });
                    if (formErrors.number) {
                      setFormErrors({ ...formErrors, number: undefined });
                    }
                  }}
                  placeholder="123"
                  className={formErrors.number ? 'p-invalid' : ''}
                />
                {formErrors.number && <small className="p-error">{formErrors.number}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="complement">Complemento</label>
                <InputText
                  id="complement"
                  value={editingAddress.complement || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, complement: e.target.value })}
                  placeholder="Apto, Bloco, etc"
                />
              </div>
            </div>

            {/* Neighborhood */}
            <div className="form-group">
              <label htmlFor="neighborhood">Bairro *</label>
              <InputText
                id="neighborhood"
                value={editingAddress.neighborhood}
                onChange={(e) => {
                  setEditingAddress({ ...editingAddress, neighborhood: e.target.value });
                  if (formErrors.neighborhood) {
                    setFormErrors({ ...formErrors, neighborhood: undefined });
                  }
                }}
                placeholder="Nome do bairro"
                className={formErrors.neighborhood ? 'p-invalid' : ''}
              />
              {formErrors.neighborhood && <small className="p-error">{formErrors.neighborhood}</small>}
            </div>

            {/* City and State */}
            <div className="form-row form-row-2col">
              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <InputText
                  id="city"
                  value={editingAddress.city}
                  onChange={(e) => {
                    setEditingAddress({ ...editingAddress, city: e.target.value });
                    if (formErrors.city) {
                      setFormErrors({ ...formErrors, city: undefined });
                    }
                  }}
                  placeholder="Cidade"
                  className={formErrors.city ? 'p-invalid' : ''}
                  maxLength={255}
                />
                {formErrors.city && <small className="p-error">{formErrors.city}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="state">Estado (UF) *</label>
                <InputText
                  id="state"
                  value={editingAddress.state}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
                    setEditingAddress({ ...editingAddress, state: value });
                    if (formErrors.state) {
                      setFormErrors({ ...formErrors, state: undefined });
                    }
                  }}
                  placeholder="SP"
                  className={formErrors.state ? 'p-invalid' : ''}
                  maxLength={2}
                />
                {formErrors.state && <small className="p-error">{formErrors.state}</small>}
              </div>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
