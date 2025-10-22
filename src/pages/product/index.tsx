import React, { useState } from 'react';
import './index.css';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

// Mock product type — adapt to your real type
type Product = {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagem: string;
  miniaturas: string[];
};

const sampleProduct: Product = {
  id: 1,
  nome: 'Guitarra Exemplo',
  marca: 'RiffHouse',
  categoria: 'Instrumentos',
  preco: 1999.99,
  descricao: 'Uma guitarra de exemplo com som incrível e acabamento premium.',
  imagem: '/assets/images/home/person1.jfif',
  miniaturas: ['/assets/images/home/person1.jfif', '/assets/images/home/person2.jfif']
};

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
//   const { id } = useParams();
  const [produto] = useState<Product>(sampleProduct);
  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [mainImage, setMainImage] = useState<string>(produto.imagem);

  const handleAddToCart = () => {
    // TODO: hook up cart service
    console.log('Adicionar ao carrinho', produto.id, quantity);
  };

  const handleBuyNow = () => {
    // TODO: add to cart + navigate to cart
    console.log('Comprar agora', produto.id, quantity);
    navigate('/carrinho');
  };

  const handleCalculateCep = () => {
    // Placeholder — integrate with frete API
    alert('Calculando frete para CEP: ' + cep);
  };

  return (
    <div className="">
        <div className="container product-page">
            <div className="grid">
                <div className="col-12 lg:col-6 flex flex-column align-items-center">
                    <div className="product-image border">
                        <img id="main-image" src={mainImage} alt={produto.nome} />
                    </div>

                    <div className="thumbnails grid">
                        {/* main image as first thumbnail */}
                        {[produto.imagem, ...produto.miniaturas].map((src, idx) => {
                        const isActive = src === mainImage;
                        return (
                            <div
                            key={idx}
                            className={`banner thumbnail-image ${isActive ? 'active' : ''}`}
                            role="button"
                            tabIndex={0}
                            aria-label={`Selecionar imagem ${idx + 1}`}
                            onClick={() => setMainImage(src)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setMainImage(src);
                            }}
                            >
                            <img src={src} alt={produto.nome} title={produto.nome} />
                            </div>
                        );
                        })}
                    </div>
                </div>

                <div className="col-12 lg:col-6 mt-0">
                <h2>{produto.nome}</h2>
                <p className="mb-0"><i>{produto.marca} - {produto.categoria}</i></p>
                <div className="mb-2 h6">
                    <span className="text-warning h4">★★★★★</span> +500 Avaliações
                </div>
                <p>Código Nº: {produto.id}</p>

                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label"><strong>Quantidade</strong></label>
                    <InputNumber id="quantity" value={quantity} onValueChange={(e) => setQuantity(e.value ?? 1)} showButtons inputClassName="w-6rem" min={1} />
                </div>

                <p>
                    <span className="price-discount">R$ {(produto.preco - (produto.preco * 0.1)).toFixed(2).replace('.', ',')}</span> à vista no Boleto (10% de desconto)
                </p>

                <p className="price-original">
                    <strong>R$ {produto.preco.toFixed(2).replace('.', ',')}</strong>  ou 12x de R$ {(produto.preco / 12).toFixed(2).replace('.', ',')} sem juros
                </p>

                <div className="mb-3 mt-3">
                    <label htmlFor="cep" className="form-label"><strong>Calcular Frete e Prazo</strong></label>
                    <div className="input-group mb-1">
                    <InputText type="number" className="p-inputtext" name="cep" placeholder="Insira seu CEP" id="cep" value={cep} onChange={(e) => setCep(e.currentTarget.value)} />
                    <Button className="p-button-text" onClick={handleCalculateCep} aria-label="Calcular frete e prazo">Calcular</Button>
                    </div>
                    <a href="#" className="small">Não sei meu CEP</a>
                </div>

                <Button className="p-button-rounded p-button-lg w-full mb-2" label="Comprar" onClick={handleBuyNow} aria-label="Comprar" />
                <Button className="p-button-secondary w-full" label="Adicionar ao Carrinho" onClick={handleAddToCart} aria-label="Adicionar ao Carrinho" />
                </div>

                <div className="col-12">
                <h4><strong>Descrição</strong></h4>
                <p>{produto.descricao}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductPage;
