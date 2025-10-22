import React, { useState } from 'react';
import './index.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

type CartItem = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
};

const sampleCart: CartItem[] = [
  { id: 1, nome: 'Guitarra Exemplo', preco: 1999.99, quantidade: 1, imagem: '/assets/images/home/person1.jfif' },
  { id: 2, nome: 'Violão Sample', preco: 799.5, quantidade: 2, imagem: '/assets/images/home/person2.jfif' }
];

function formatCurrency(value: number) {
  return value.toFixed(2).replace('.', ',');
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(sampleCart);

  const updateQuantity = (id: number, qty: number) => {
    setCart((prev) => prev.map(item => item.id === id ? { ...item, quantidade: qty } : item));
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((s, item) => s + item.preco * item.quantidade, 0);
  const descontos = 0.0; // placeholder
  const total = subtotal - descontos;

  const handleFinalize = () => {
    alert('Finalizando compra: total R$ ' + total.toFixed(2));
  };

  return (
    <div className="cart-page">

      <div className="container">
        <h2>Resumo dos Produtos</h2>
        <div className="p-grid">
          <div className="p-col-12 p-lg-8">
            <div id="carrinho-container" className="flex flex-column align-items-center">
              {cart.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="product-item container row p-0">
                    <div className="col-lg-2 col-6 ms-auto me-auto p-0 mb-lg-0 mb-3">
                      <a href="#" className="ver-produto" onClick={(e) => { e.preventDefault(); navigate(`/produto/${item.id}`); }} data-id={item.id}>
                        <div className="h-100 w-100 d-flex justify-content-center align-items-center border banner">
                          <img src={item.imagem} alt={item.nome} className="img-fluid product-image" data-id={item.id} title={item.nome} />
                        </div>
                      </a>
                    </div>

                    <div className="descricao col-lg-6">
                      <h5 className="">{item.nome}</h5>
                      <small className="w-100 d-lg-block d-flex justify-content-around align-items-center mb-lg-0 mb-3 fs-7">
                        <p>
                          <strong>Marca:</strong> {item.nome ? item.nome : ''}
                        </p>
                        <p className="mb-lg-2">
                          <strong>Categoria:</strong> {/* category unknown in cart item */}
                        </p>
                        <small>
                          <span className="price text-muted">
                            <strong>R$ <span>{formatCurrency(item.preco)}</span></strong> por unidade
                          </span>
                        </small>
                      </small>
                    </div>

                    <div className="informacao col-lg-4">
                      <div className="prices w-100 h-100 mb-2 d-flex flex-column align-items-center align-items-lg-end justify-content-lg-between">
                        <h5 className="product-price d-block">
                          <strong>R$ <span>{formatCurrency(item.preco * item.quantidade)}</span></strong>
                        </h5>
                        <div className="input-group my-2 my-lg-0">
                          <input
                            name="quantidade"
                            type="number"
                            className="form-control text-center input-quantidade"
                            value={item.quantidade}
                            min={1}
                            aria-label={`Quantidade de ${item.nome}`}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, Number(e.target.value) || 1))}
                          />
                        </div>
                        <button className="btn-outline btn-excluir-cart mt-2" data-id={item.id} aria-label="Remover produto do carrinho" onClick={() => removeItem(item.id)}>
                          <i className="pi pi-trash m-1"></i> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div id="sumario-container" className="p-col-12 p-lg-4">
            <div className="div-sumario sticky-top">
              <div className="summary-card">
                <h2>Resumo da Compra</h2>
                <p>Produtos: <span id="quantidadeTotal">{cart.reduce((s, it) => s + it.quantidade, 0)}</span></p>
                <p>Subtotal: R$ <span id="subtotal">{subtotal.toFixed(2)}</span></p>
                <p>Descontos: R$ <span id="descontos">{descontos.toFixed(2)}</span></p>
                <p><strong>Total: R$ <span id="total">{total.toFixed(2)}</span></strong></p>

                <select className="form-select" aria-label="Default select example" id="metodos-pagamento">
                  <option selected disabled>Métodos de Pagamento</option>
                  <option value="1">Cartão de Crédito</option>
                  <option value="2">Cartão de Débito</option>
                  <option value="3">Boleto</option>
                  <option value="4">Pix</option>
                </select>

                <Button className="btn-default w-full mt-3" id="btn-finalizar-compra" onClick={handleFinalize}>
                  <i className="pi pi-check me-2"></i> Finalizar Compra
                </Button>

                <Button className="btn-gray w-full mt-2" onClick={() => navigate('/#produtos')}>
                  <i className="pi pi-shopping-cart me-2"></i> Continuar Comprando
                </Button>
              </div>

              <div className="address-card mt-1">
                <div className="flex justify-content-between align-items-center">
                  <h4><i className="pi pi-map-marker"></i> Endereço de Entrega</h4>
                  <button className="text-decoration-none text-dark" id="btn-editar-endereco" title="Editar Endereço">
                    <i className="pi pi-pencil"></i>
                  </button>
                </div>
                <div className="flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <p id="enderecoEntrega" className="mb-0">Nenhum endereço selecionado</p>
                  </small>
                  <button className="text-decoration-none text-danger" id="btn-excluir-endereco" title="Excluir Endereço">
                    <i className="pi pi-trash"></i>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
