import type { IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import type React from "react";

import "./productActions.style.css";

export const ProductActions: React.FC<{
    produto: IProduct,
    quantity: number,
    handleBuyNow: (product: IProduct, quantity: number) => void;
    handleAddToCart: (product: IProduct, quantity: number) => void
}> = ({
    produto,
    quantity,
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