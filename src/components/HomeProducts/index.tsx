import { getAllProductsPageable } from "@/services/product-service";
import { useEffect, useState } from "react";
import { CardProduct } from "../card-product";
import type { IProduct } from "@/commons/types/types";

export const HomeProducts: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // TODO: fazer uma paginação de produtos ou "carregar mais" para buscar mais produtos
                const response = await getAllProductsPageable(0, 10);
                setProducts(response.content);
            } catch (err) {
                setError('Erro ao carregar produtos. Por favor, tente novamente mais tarde.');
                console.error('Erro ao buscar produtos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section id="products" className="section products-section">
            <div className="section-inner">
                <div className="section-header">
                    <h2 className="section-title">Produtos</h2>
                    <p className="section-subtitle">Os melhores produtos feitos para você!</p>
                </div>

                {loading ? <div className="loading">Carregando produtos ...</div> : null}
                
                {error ? <div className="error">{error} <i className='pi pi-exclamation-circle'></i> </div> : null}
                

                <div id="products-container" className="products-grid" role="grid" aria-label="Grade de produtos">
                        {products.map((product) => (
                            <CardProduct key={product.id} product={product} />
                        ))}
                </div>
            </div>
        </section>
    );
};