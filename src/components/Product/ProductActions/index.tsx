import type { IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import type React from "react";

import "./product-actions.style.css";
import { useProduct } from "@/hooks/useProduct";

export const ProductActions: React.FC<{
    produto: IProduct;
    quantity: number;
}> = ({ produto, quantity }) => {
    const { handleBuyProduct, handleAddToCart } = useProduct();
    return (
        <div className="product-actions">
            <Button
                className="w-full button-action"
                severity="success"
                onClick={() => handleBuyProduct(produto, quantity)}
                aria-label="Comprar agora"
                icon="pi pi-shopping-bag"
            >
                Comprar
            </Button>
            <Button
                className="w-full button-action"
                severity="info"
                outlined
                onClick={() => handleAddToCart(produto, quantity)}
                aria-label="Adicionar ao carrinho"
                icon="pi pi-cart-plus"
            >
                Adicionar ao Carrinho
            </Button>
        </div>
    );
};
