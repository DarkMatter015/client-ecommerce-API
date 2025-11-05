import { Button } from "primereact/button";
import type React from "react";

import "./emptyCart.style.css";

export const EmptyCart: React.FC<{
    onContinueShopping: () => void
}> = ({
    onContinueShopping,
}) => (
        <div className="empty-cart" role="status">
            <i className="pi pi-shopping-cart empty-cart-icon" aria-hidden="true"></i>
            <p>Seu carrinho está vazio</p>
            <Button
                className="btn-default"
                onClick={onContinueShopping}
                aria-label="Ir para página de produtos"
            >
                <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
                Ir às Compras
            </Button>
        </div>
    );