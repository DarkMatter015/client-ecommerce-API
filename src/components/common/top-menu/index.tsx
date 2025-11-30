import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./top-menu.style.css";

import { useProductSearch, useMenuItems } from "./hooks";
import { DesktopActions, MobileMenu } from "./components";
import { NavbarMenuDesktop } from "./NavbarMenuDesktop";
import { NavbarSearchDesktop } from "./NavbarSearchDesktop";
import { scrollIntoView } from "@/utils/Utils";

const TopMenu: React.FC = () => {
    const location = useLocation();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Hooks
    const { filteredProducts, selectedProduct, setSelectedProduct, search } =
        useProductSearch();
    const { menuItems, userMenuItems } = useMenuItems();

    // Scroll behavior
    useEffect(() => {
        if (location.hash) {
            const hash = location.hash.replace("#", "");
            scrollIntoView(hash);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname, location.hash]);

    return (
        <>
            <nav className="top-navbar" aria-label="Navegação principal">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/#home" className="navbar-logo">
                        <img
                            src="/assets/images/logo/logo_riffhouse_red.png"
                            alt="Riffhouse"
                            className="logo-image"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <NavbarMenuDesktop menuItems={menuItems} />

                    {/* Desktop Search Bar */}
                    <NavbarSearchDesktop
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        filteredProducts={filteredProducts}
                        search={search}
                    />

                    {/* Desktop Actions */}
                    <DesktopActions userMenuItems={userMenuItems} />

                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar-mobile-toggle"
                        onClick={() => setSidebarVisible(true)}
                        aria-label="Abrir menu"
                    >
                        <i className="pi pi-bars"></i>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu
                isVisible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                menuItems={menuItems}
                userMenuItems={userMenuItems}
                filteredProducts={filteredProducts}
                selectedProduct={selectedProduct}
                onProductSelect={setSelectedProduct}
                onSearch={search}
            />
        </>
    );
};

export default TopMenu;
