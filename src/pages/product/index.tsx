import React, { useCallback, useMemo, useRef, useState } from 'react';
import './index.css';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

/* ===========================
   TYPES & MOCK DATA
   =========================== */
type Product = {
  id: number;
  nome: string;
  marca?: string;
  categoria?: string;
  preco: number;
  descricao: string;
  imagem: string;
  miniaturas?: string[];
};

const SAMPLE_PRODUCT: Product = {
  id: 1,
  nome: 'Guitarra Exemplo',
  marca: 'Fender',
  categoria: 'Guitarras',
  preco: 1999.99,
  descricao: 'Uma guitarra de exemplo com som incrível e acabamento premium. Ideal para estúdio e shows.',
  imagem: '/assets/images/home/person1.jfif',
  miniaturas: ['/assets/images/home/person1.jfif', '/assets/images/home/person2.jfif']
};

/* ===========================
   HELPERS
   =========================== */
const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ===========================
   COMPONENT
   =========================== */
const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast | null>(null);

  const [produto] = useState<Product>(SAMPLE_PRODUCT);
  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>(produto.imagem);
  const [zoomVisible, setZoomVisible] = useState(false);

  const thumbnails = useMemo(() => [produto.imagem, ...(produto.miniaturas ?? [])], [produto]);

  const pricePerUnit = useMemo(() => produto.preco, [produto.preco]);

  const handleAddToCart = useCallback(() => {
    // TODO: integrate with cart context or service
    toast.current?.show({ severity: 'success', summary: 'Adicionado', detail: `${produto.nome} adicionado ao carrinho`, life: 2000 });
  }, [produto.nome]);

  const handleBuyNow = useCallback(() => {
    // placeholder: add to cart then navigate
    navigate('/carrinho');
  }, [navigate]);

  const handleCalculateCep = useCallback(() => {
    // todo: replace with API call
    alert(`Calculando frete para CEP: ${cep}`);
  }, [cep]);

  const handleThumbnailKey = (e: React.KeyboardEvent, src: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMainImage(src);
    }
  };

  return (
    <div className="product-page">
      <Toast ref={toast} />

      <div className="container">
        <div className="grid">
          <div className="col-12 lg:col-6 flex flex-column align-items-center">
            <div className="product-image border" role="img" aria-label={`Imagem do produto ${produto.nome}`} onClick={() => setZoomVisible(true)}>
              <img id="main-image" src={mainImage} alt={produto.nome} />
            </div>

            <div className="thumbnails" role="list" aria-label="Miniaturas do produto">
              {thumbnails.map((src, idx) => {
                const isActive = src === mainImage;
                return (
                  <div
                    key={idx}
                    role="listitem"
                    className={`banner thumbnail-image ${isActive ? 'active' : ''}`}
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`Selecionar imagem ${idx + 1}`}
                    onClick={() => setMainImage(src)}
                    onKeyDown={(e) => handleThumbnailKey(e, src)}
                  >
                    <img src={src} alt={`${produto.nome} miniatura ${idx + 1}`} title={produto.nome} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-12 lg:col-6 mt-0">
            <h1 className="product-title">{produto.nome}</h1>
            <p className="mb-0"><i>{produto.marca} - {produto.categoria}</i></p>
            <div className="mb-2 h6">
              <span className="text-warning h4" aria-hidden>★★★★★</span>
              <span className="sr-only">5 de 5 estrelas</span>
              <span className="visually-hidden"> +500 avaliações</span>
            </div>
            <p>Código Nº: {produto.id}</p>

            <div className="product-price-section">
              <div className="product-price">
                <span className="price-label">Preço:</span>
                <span className="price-value">R$ {formatCurrency(pricePerUnit)}</span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="quantity" className="form-label"><strong>Quantidade</strong></label>
              <InputNumber id="quantity" value={quantity} onValueChange={(e) => setQuantity(e.value ?? 1)} showButtons inputClassName="w-6rem" min={1} aria-label="Quantidade" />
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="cep" className="form-label"><strong>Calcular Frete e Prazo</strong></label>
              <div className="input-group mb-1">
                <InputText type="text" id="cep" className="p-inputtext" name="cep" placeholder="Insira seu CEP" value={cep} onChange={(e) => setCep(e.currentTarget.value)} aria-label="CEP" />
                <Button className="p-button-text" onClick={handleCalculateCep} aria-label="Calcular frete e prazo">Calcular</Button>
              </div>
              <a href="#" className="small">Não sei meu CEP</a>
            </div>

            <div className="product-actions">
              <Button className="btn-default w-full mb-2" onClick={handleBuyNow} aria-label="Comprar agora">Comprar</Button>
              <Button className="btn-gray w-full" onClick={handleAddToCart} aria-label="Adicionar ao carrinho">Adicionar ao Carrinho</Button>
            </div>
          </div>

          <div className="col-12">
            <h4><strong>Descrição</strong></h4>
            <p>{produto.descricao}</p>
          </div>
        </div>
      </div>

      <Dialog header={produto.nome} visible={zoomVisible} style={{ width: '90vw', maxWidth: '800px' }} onHide={() => setZoomVisible(false)}>
        <div style={{ textAlign: 'center' }}>
          <img src={mainImage} alt={produto.nome} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </Dialog>
    </div>
  );
};

export default ProductPage;
