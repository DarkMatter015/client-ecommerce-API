import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

import "./emptyCart.style.css";

export const EmptyCart = () => {
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate("/");
    };
    
    return (
        <div className="empty-cart" role="status">
            <i className="pi pi-shopping-cart empty-cart-icon" aria-hidden="true"></i>
            <p>Seu carrinho está vazio</p>
            <Button
                severity="info"
                icon="pi pi-arrow-left"
                label="Ir às Compras"
                className="p-button-outlined p-button-secondary"
                onClick={handleContinueShopping}
                aria-label="Ir para página de produtos"
            />
        </div>
    );
};
