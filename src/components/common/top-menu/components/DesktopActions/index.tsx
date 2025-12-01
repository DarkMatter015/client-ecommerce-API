import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import "./desktop-actions.css";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";

interface UserMenuItem {
    label: string;
    icon: string;
    command: () => void;
}

interface DesktopActionsProps {
    userMenuItems: UserMenuItem[];
}

export const DesktopActions: React.FC<DesktopActionsProps> = ({
    userMenuItems,
}) => {
    const navigate = useNavigate();
    const menuRef = useRef<Menu>(null);
    const { cartMetrics } = useCart();
    const { authenticated, authenticatedUser } = useAuth();

    const cartItemsCount = cartMetrics?.totalItems ? cartMetrics.totalItems : 0;

    return (
        <div className="navbar-actions-desktop">
            {/* Cart Button */}
            <button
                className="navbar-icon-btn cart-btn"
                onClick={() => navigate("/carrinho")}
                aria-label="Ver carrinho"
                title="Meu Carrinho"
            >
                <i className="pi pi-shopping-cart"></i>
                {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                )}
            </button>

            {/* User Menu */}
            <div className="navbar-user-section">
                {authenticated ? (
                    <button
                        className="navbar-user-btn authenticated"
                        onClick={(e) => menuRef.current?.toggle(e)}
                        aria-label="Menu do usuário"
                        title={authenticatedUser?.displayName}
                    >
                        <i className="pi pi-user"></i>
                        <span className="user-name">
                            {authenticatedUser?.displayName}
                        </span>
                    </button>
                ) : (
                    <button
                        className="navbar-user-btn"
                        onClick={(e) => menuRef.current?.toggle(e)}
                        aria-label="Menu de autenticação"
                    >
                        <i className="pi pi-user"></i>
                        <span className="auth-text">Entre ou Cadastre-se</span>
                    </button>
                )}
            </div>

            <Menu
                model={userMenuItems}
                popup
                ref={menuRef}
                id="popup_menu_left"
            />
        </div>
    );
};
