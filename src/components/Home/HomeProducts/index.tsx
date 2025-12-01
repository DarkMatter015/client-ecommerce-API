import { getAllProductsFiltered } from "@/services/product-service";
import React, { useCallback, useEffect, useState } from "react";
import { CardProduct } from "../../CardProduct";
import { Paginator } from "primereact/paginator";
import type { ICategory, IProduct } from "@/commons/types/types";

import './home-products.style.css';
import { CategoryDropdown } from "@/components/Category/CategoryDropdown";

export const HomeProducts: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(8);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<ICategory | null>(null);

    const fetchProducts = useCallback(async (pageIndex: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await getAllProductsFiltered(
                pageIndex,
                pageSize,
                undefined,
                category?.name
            );

            if (response) {
                setProducts(response.content);
                setTotalElements(response.totalElements);
            }
        } catch (err) {
            setError(
                "Erro ao carregar produtos. Por favor, tente novamente mais tarde."
            );
            console.error("Erro ao buscar produtos:", err);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        
    fetchProducts(0, 10);
    }, [rows, category, fetchProducts]);

    const handlePageChange = (e: any) => {
        const newFirst = e.first;
        const newRows = e.rows;
        setFirst(newFirst);
        setRows(newRows);
        
        const pageIndex = Math.floor(newFirst / newRows);
        fetchProducts(pageIndex, newRows);
    };

    return (
        <section id="products" className="section products-section">
            <div className="section-inner">
                <div className="section-header">
                    <h2 className="section-title">Produtos</h2>
                    <p className="section-subtitle">Os melhores produtos feitos para você!</p>
                </div>

                <div className="category-dropdown-container">
                    <CategoryDropdown
                    value={category}
                    onChange={setCategory}
                    placeholder="Selecione uma categoria"
                    />
                </div>

                {error && <div className="error">{error} <i className='pi pi-exclamation-circle'></i></div>}
                
                {loading ? (
                    <div className="loading">Carregando produtos...</div>
                ) : totalElements > 0 ? (
                    <>
                        <div className="products-grid">
                            {products.map((product) => (
                                <CardProduct key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="paginator-container">
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={totalElements}
                                rowsPerPageOptions={[8, 16, 24, 32]}
                                onPageChange={handlePageChange}
                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            />
                        </div>
                    </>
                ) : (
                    <div className="no-products">
                        <p>Nenhum produto disponível.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
