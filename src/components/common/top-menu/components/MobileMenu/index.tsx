import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { scrollIntoView } from "@/utils/Utils";
import { MobileSearch } from "../MobileSearch";
import { MobileMenuLinks } from "../MobileMenuLinks";
import { MobileUserSection } from "../MobileUserSection";
import { MobileCartButton } from "../MobileCartButton";
import "./mobile-menu.css";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";

interface MenuItem {
    label: string;
    path: string;
    hash: string;
    icon: string;
}

interface UserMenuItem {
    label: string;
    icon: string;
    command: () => void;
}

interface ProductGroup {
    label: string;
    items: any[];
}

interface MobileMenuProps {
    isVisible: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    userMenuItems: UserMenuItem[];
    filteredProducts: ProductGroup[];
    selectedProduct: any;
    onProductSelect: (product: any) => void;
    onSearch: (event: any) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
    isVisible,
    onClose,
    menuItems,
    userMenuItems,
    filteredProducts,
    selectedProduct,
    onProductSelect,
    onSearch,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartMetrics } = useCart();
    const { authenticated, authenticatedUser } = useAuth();

    const cartItemsCount = cartMetrics?.totalItems ? cartMetrics.totalItems : 0;

    const handleMenuItemClick = (item: MenuItem) => {
        if (location.pathname === item.path) {
            scrollIntoView(item.hash);
        }
        onClose();
    };

    const handleProductSelect = (product: any) => {
        onProductSelect(product);
        if (product?.id) {
            navigate(`/produto/${product.id}`);
            onClose();
        }
    };

    return (
        <Sidebar
            visible={isVisible}
            onHide={onClose}
            className="mobile-sidebar"
            position="right"
            blockScroll
        >
            <div className="mobile-sidebar-content">
                {/* Logo */}
                <div className="mobile-logo">
                    <img
                        src="/assets/images/logo/logo_riffhouse_red.png"
                        alt="Riffhouse"
                    />
                </div>

                {/* Search */}
                <MobileSearch
                    filteredProducts={filteredProducts}
                    selectedProduct={selectedProduct}
                    onProductSelect={handleProductSelect}
                    onSearch={onSearch}
                />

                {/* Menu Links */}
                <MobileMenuLinks
                    menuItems={menuItems}
                    onItemClick={handleMenuItemClick}
                />

                {/* User Section */}
                <MobileUserSection
                    authenticated={authenticated}
                    authenticatedUser={authenticatedUser}
                    userMenuItems={userMenuItems}
                    onActionClick={onClose}
                />

                {/* Cart Button */}
                <MobileCartButton
                    cartItemsCount={cartItemsCount}
                    onCartClick={() => {
                        navigate("/carrinho");
                        onClose();
                    }}
                />
            </div>
        </Sidebar>
    );
};
