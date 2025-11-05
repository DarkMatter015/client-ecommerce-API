import React, { useCallback, useMemo, useEffect, useRef, useState, use } from 'react';
import './product.style.css';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '@/services/product-service';
import type { IProduct } from '@/commons/types/types';
import { CartContext } from '@/context/CartContext';
import { ProductThumbnail } from '@/components/ProductThumbnail';
import { ProductInfo } from '@/components/ProductInfo';
import { CalcFrete } from '@/components/CalcFrete';
import { ProductActions } from '@/components/ProductActions';
import { ProductDescription } from '@/components/ProductDescription';


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
                <ProductThumbnail
                  setMainImage={setMainImage}
                  handleThumbnailKey={handleThumbnailKey}
                  idx={idx}
                  isActive={src === mainImage}
                  key={idx}
                  src={src}
                  product={produto}
                />
              ))}
            </div>
          </div>

          <div className="col-12 lg:col-6 mt-0">
            <ProductInfo
              pricePerUnit={pricePerUnit}
              quantity={quantity}
              setQuantity={setQuantity}
              product={produto}
            />
            <CalcFrete
              cep={cep}
              setCep={setCep}
              handleCalculateCep={handleCalculateCep}
            />
            <ProductActions
              produto={produto}
              quantity={quantity}
              handleBuyNow={() => handleBuyNow(produto, quantity)}
              handleAddToCart={() => handleAddToCart(produto, quantity)}
            />
          </div>

          <ProductDescription
            product={produto}
          />
        </div>
      </div>

      <Dialog
        header={produto.name}
        visible={zoomVisible}
        style={{ width: '90vw', maxWidth: '800px' }}
        onHide={() => setZoomVisible(false)}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={mainImage} alt={produto.name} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </Dialog>
    </div>
  );
};

export default ProductPage;
