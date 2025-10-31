import React, { useCallback, useMemo, useEffect, useRef, useState, use } from 'react';
import './product.style.css';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '@/services/product-service';
import type { IProduct } from '@/commons/types/types';
import { CartContext } from '@/context/CartContext';

/* ===========================
   HELPERS
   =========================== */
const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ===========================
   COMPONENT
   =========================== */
const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idParam = params.id;
  const toast = useRef<Toast | null>(null);
  const [produto, setProduto] = useState<IProduct>({} as IProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>(produto.urlImage);
  const [zoomVisible, setZoomVisible] = useState(false);

  const { addItem } = use(CartContext)

  // thumbnails: ensure we always pass an array of image urls
  const thumbnails = useMemo(() => {
    const arr: string[] = [];
    if (produto.urlImage) arr.push(produto.urlImage);
    // if future data has an array field like 'miniaturas', include them
    const mini = (produto as any).miniaturas;
    if (Array.isArray(mini)) arr.push(...mini);
    return arr;
  }, [produto]);

  const pricePerUnit = useMemo(() => produto.price, [produto.price]);

  const handleAddToCart = useCallback((product: IProduct, quantity: number) => {
    addItem({
      product,
      quantity,
    });
    toast.current?.show({ severity: 'success', summary: 'Adicionado', detail: `${produto.name} adicionado ao carrinho`, life: 2000 });
  }, [produto.name, addItem]);

  const handleBuyNow = useCallback((product: IProduct, quantity: number) => {
    addItem({
      product,
      quantity,
    });
    navigate('/carrinho');
  }, [navigate, addItem]);

  const handleCalculateCep = useCallback(() => {
    // todo: replace with API call
    alert(`Calculando frete para CEP: ${cep}`);
  }, [cep]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!idParam) {
        setError('ID do produto não encontrado na URL');
        setLoading(false);
        return;
      }

      try {
        const response = await getProductById(idParam);
        setProduto(response);
      } catch (err) {
        setError('Erro ao carregar produto. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    };
    setMainImage(produto.urlImage);
    fetchProduct();
  }, [idParam, produto.urlImage]);

  if (loading) return <div className="loading">Carregando produtos ...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleThumbnailKey = (e: React.KeyboardEvent, src: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMainImage(src);
    }
  };

  const Thumbnail: React.FC<{ product: IProduct, isActive: boolean, src: string, idx: number}> = ({ 
    product,
    isActive, 
    src, 
    idx
  }) => {
    return (
      <div
        key={idx}
        role="listitem"
        className={`banner thumbnail-image ${isActive ? 'active' : ''}`}
        tabIndex={0}
        aria-pressed={isActive}
        aria-label={`Selecionar urlImage ${idx + 1}`}
        onClick={() => setMainImage(src)}
        onKeyDown={(e) => handleThumbnailKey(e, src)}
      >
        <img src={src} alt={`${product.name} miniatura ${idx + 1}`} title={product.name} />
      </div>
    );
  }

  const ProductInfo: React.FC<{ product: IProduct }> = ({ product }) => {
    return (
      <>
        <div>
          <h1 className="product-title">{product.name}</h1>
          <p className="mb-0"><i>{product.name} - {product.category.name}</i></p>
          <div className="mb-2 h6">
            <span className="text-warning h4" aria-hidden>★★★★★</span>
            <span className="sr-only">5 de 5 estrelas</span>
            <span className="visually-hidden"> +500 avaliações</span>
          </div>
          <p>Código Nº: {product.id}</p>
        </div>

        <div className="product-price-section">
          <div className="product-price">
            <span className="price-label">Preço:</span>
            <span className="price-value">R$ {formatCurrency(pricePerUnit)}</span>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label"><strong>Quantidade</strong></label>
          <InputNumber inputId='quantity' value={quantity} onValueChange={(e) => setQuantity(e.value ?? 1)} showButtons inputClassName="w-6rem" min={1} aria-label="Quantidade" />
        </div>
      </>
    );
  };

  const Description: React.FC<{ product: IProduct }> =({ product }) => {
    return (
      <div className="col-12">
        <h4><strong>Descrição</strong></h4>
        <p>{product.description}</p>
      </div>
    )
  }
  
  
  const ProductActions: React.FC<{ handleBuyNow: (product: IProduct, quantity: number) => void; handleAddToCart: (product: IProduct, quantity: number) => void}> =({
    handleBuyNow,
    handleAddToCart
   }) => {
    return (
      <div className="product-actions">
          <Button className="btn-default w-full mb-2" onClick={() => handleBuyNow(produto, quantity)} aria-label="Comprar agora">Comprar</Button>
          <Button className="btn-gray w-full" onClick={() => handleAddToCart(produto, quantity)} aria-label="Adicionar ao carrinho">Adicionar ao Carrinho</Button>
      </div>
    )
  }

  const CalcFrete: React.FC<{ handleCalculateCep: () => void}> = ({
    handleCalculateCep, 
  }) => {
    return (
      <div className="mb-3 mt-3">
        <label htmlFor="cep" className="form-label"><strong>Calcular Frete e Prazo</strong></label>
        <div className="input-group mb-1">
          <InputText type="text" id="cep" className="p-inputtext" name="cep" placeholder="Insira seu CEP" value={cep} onChange={(e) => setCep(e.currentTarget.value)} aria-label="CEP" />
          <Button className="p-button-text" onClick={handleCalculateCep} aria-label="Calcular frete e prazo">Calcular</Button>
        </div>
        <a href="#" className="small">Não sei meu CEP</a>
      </div>
    )
  }

  return (
    <div className="product-page">
      <Toast ref={toast} />

      <div className="container">
        <div className="grid">
          <div className="col-12 lg:col-6 flex flex-column align-items-center">
            <div className="product-image border" role="img" aria-label={`Imagem do produto ${produto.name}`} onClick={() => setZoomVisible(true)}>
              <img id="main-image" src={mainImage} alt={produto.name} />
            </div>

            <div className="thumbnails" role="list" aria-label="Miniaturas do produto">
              {thumbnails.map((src, idx) => (
                <Thumbnail idx={idx} isActive={src === mainImage} key={idx} src={src} product={produto} />
              ))}
            </div>
          </div>

          <div className="col-12 lg:col-6 mt-0">
            <ProductInfo product={produto} />
            <CalcFrete handleCalculateCep={handleCalculateCep}/>
            <ProductActions handleBuyNow={() => handleBuyNow(produto, quantity)} handleAddToCart={() => handleAddToCart(produto, quantity)} />
          </div>

          <Description product={produto} />
        </div>
      </div>

      <Dialog header={produto.name} visible={zoomVisible} style={{ width: '90vw', maxWidth: '800px' }} onHide={() => setZoomVisible(false)}>
        <div style={{ textAlign: 'center' }}>
          <img src={mainImage} alt={produto.name} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </Dialog>
    </div>
  );
};

export default ProductPage;
