import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import './product.style.css';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '@/services/product-service';
import type { Product } from '@/commons/types/product';

/* ===========================
   TYPES & MOCK DATA
   =========================== */

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
  const [produto, setProduto] = useState<Product>({} as Product);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>(produto.urlImage);
  const [zoomVisible, setZoomVisible] = useState(false);

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

  const handleAddToCart = useCallback(() => {
    // TODO: integrate with cart context or service
    toast.current?.show({ severity: 'success', summary: 'Adicionado', detail: `${produto.name} adicionado ao carrinho`, life: 2000 });
  }, [produto.name]);

  const handleBuyNow = useCallback(() => {
    // placeholder: add to cart then navigate
    navigate('/carrinho');
  }, [navigate]);

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
              {thumbnails.map((src, idx) => {
                const isActive = src === mainImage;
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
                    <img src={src} alt={`${produto.name} miniatura ${idx + 1}`} title={produto.name} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-12 lg:col-6 mt-0">
            <h1 className="product-title">{produto.name}</h1>
            <p className="mb-0"><i>{produto.name} - {produto.category.name}</i></p>
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
              <InputNumber inputId='quantity' value={quantity} onValueChange={(e) => setQuantity(e.value ?? 1)} showButtons inputClassName="w-6rem" min={1} aria-label="Quantidade" />
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
            <p>{produto.description}</p>
          </div>
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
