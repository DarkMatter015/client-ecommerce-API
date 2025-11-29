import React from "react";

interface MobileCartButtonProps {
    cartItemsCount: number;
    onCartClick: () => void;
}

export const MobileCartButton: React.FC<MobileCartButtonProps> = ({
    cartItemsCount,
    onCartClick,
}) => {
    return (
        <div className="mobile-menu-section">
            <button className="mobile-cart-btn" onClick={onCartClick}>
                <div className="mobile-cart-content">
                    <i className="pi pi-shopping-cart"></i>
                    <span>Meu Carrinho</span>
                </div>
                {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                )}
            </button>
        </div>
    );
};
