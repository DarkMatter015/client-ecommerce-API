import React from 'react';
import { Button } from 'primereact/button';
import './home.style.css';
import { useEffect, useState } from 'react';
import type { Product } from '../../commons/types/product';
import { getProducts } from '../../services/product-service';
import { CardProduct } from '@/components/card-product';

/*
    Refatorado: HomePage dividido em pequenas seções (Hero, Products, Testimonials, About)
    - Title adjusted so "Inspira" is rendered as a separate line visually
    - Products section: left-aligned heading & subtitle; categories removed
    - Testimonials: background image on left (desktop) + stacked cards on the right; image hidden on mobile
*/

const Hero: React.FC = () => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="hero-line">O Som Que Te</span>
                    <span className="hero-accent">Inspira</span>
                </h1>

                <p className="hero-subtitle">Instrumentos musicais de qualidade para músicos apaixonados. Encontre o seu som na RiffHouse.</p>

                <div className="hero-actions">
                    <Button className="btn-outline" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>Ver Products</Button>
                    <Button className="btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Sobre Nós</Button>
                </div>

                <div className="social-media-buttons">
                    <a className="p-link" href="#" aria-label="Facebook" title='facebook'><i className="pi pi-facebook" /></a>
                    <a className="p-link" href="#" aria-label="Instagram" title='instagram'><i className="pi pi-instagram" /></a>
                    <a className="p-link" href="#" aria-label="Whatsapp" title='whatsapp'><i className="pi pi-whatsapp" /></a>
                </div>
            </div>

            <div className="hero-visual">
                <img src="/assets/images/home/fundo1.svg" alt="Pessoa escutando música" loading="lazy" />
            </div>
        </section>
    );
};

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts(0, 10);
                // response is a Page<Product>
                setProducts(response.content);
            } catch (err) {
                setError('Erro ao carregar products. Por favor, tente novamente mais tarde.');
                console.error('Erro ao buscar products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading">Carregando products...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <section id="products" className="section products-section">
            <div className="section-inner">
                <div className="section-header">
                    <h2 className="section-title">Products</h2>
                    <p className="section-subtitle">Os melhores products feitos para você!</p>
                </div>

                <div id="products-container" className="products-grid" role="grid" aria-label="Grade de products">
                        {products.map((product) => (
                            <CardProduct key={product.id} product={product} />
                        ))}
                </div>
            </div>
        </section>
    );
};

const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="section testimonials-section">
            <div className="testimonials-inner">
                <div className="testimonials-image" aria-hidden>
                    <img src="/assets/images/home/fundo2.svg" alt="Pessoas curtindo a página" />
                </div>

                <div className="testimonials-content">
                    <h2 className="section-title">Avaliações</h2>
                    <p className="section-subtitle">O que nossos clientes acham dos nossos products</p>

                    <div className="feedbacks">
                        <article className="card-feedback">
                            <img className="feedback-image" src="/assets/images/home/person1.jfif" alt="Cliente 1" />
                            <div className="feedback-body">
                                <strong>Ricardo da Silva</strong>
                                <div className="rating" aria-hidden>★★★★★</div>
                                <p>Loja muito bem organizada, com ótimos preços e suporte atencioso. Recomendo para todos os músicos!</p>
                            </div>
                        </article>

                        <article className="card-feedback">
                            <img className="feedback-image" src="/assets/images/home/person2.jfif" alt="Cliente 2" />
                            <div className="feedback-body">
                                <strong>Aline Silveira</strong>
                                <div className="rating" aria-hidden>★★★★★</div>
                                <p>Excelente atendimento e variedade incrível de products musicais. Comprei minha guitarra e chegou antes do prazo!</p>
                            </div>
                        </article>
                    </div>

                    <button className="btn-outline mt-3">Ver mais Avaliações</button>
                </div>
            </div>
        </section>
    );
};

const About: React.FC = () => (
    <section id="about" className="section about-section">
        <div className="section-inner">
            <div className="about-text">
                <h2 className='section-title'>Sobre a RiffHouse</h2>
                <p>Na RiffHouse, acreditamos que um instrumento musical não é apenas uma ferramenta, mas uma extensão da alma de quem toca. Nascemos da vontade de unir arte, autenticidade e experiência sonora, criando um espaço onde músicos encontram mais do que products — encontram identidade.</p>
                <p>Nossa loja é um tributo à expressão criativa. Cada guitarra, violão ou acessório carrega consigo história, estilo e personalidade, pensados nos mínimos detalhes para transformar cada nota tocada em algo memorável.</p>
            </div>
            <div className="about-image">
                <img src="/assets/images/home/fundo_about.png" alt="Interior da loja RiffHouse" loading="lazy" />
            </div>
        </div>
    </section>
);

export const HomePage: React.FC = () => {
    return (
        <main className="home-page">
            <Hero />
            <Products />
            <Testimonials />
            <About />
        </main>
    );
};