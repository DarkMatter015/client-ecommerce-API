import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import "@/components/top-menu/index.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<Menu>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItemsCount = 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Buscar por:", searchQuery);
    }
  };

  const menuItems = [
    { label: "Home", path: "/#home", icon: "pi pi-home" },
    { label: "Produtos", path: "/#produtos", icon: "pi pi-shopping-bag" },
    { label: "Avaliações", path: "/#testimonials", icon: "pi pi-star" },
    { label: "Sobre Nós", path: "/#about", icon: "pi pi-info-circle" }
  ];

  const userMenuItems = [
    {
      label: "Entrar",
      icon: "pi pi-sign-in",
      command: () => navigate("/login")
    },
    {
      label: "Cadastrar-se",
      icon: "pi pi-user-plus",
      command: () => navigate("/register")
    }
  ];

  return (
    <>
      <nav className="top-navbar" aria-label="Navegação principal">
        <div className="navbar-container">
          {/* Logo */}
          <a
            className="navbar-logo"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img
              src="/assets/images/logo/logo_riffhouse_red.png"
              alt="Riffhouse"
              className="logo-image"
            />
          </a>

          {/* Menu Desktop */}
          <div className="navbar-menu-desktop">
            <ul className="menu-list">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    className="menu-link"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Barra de Busca Desktop */}
          <form className="navbar-search-desktop" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <i className="pi pi-search search-icon"></i>
              <input
                type="search"
                className="search-input"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar produtos"
              />
            </div>
          </form>

          {/* Ações Desktop */}
          <div className="navbar-actions-desktop">
            <button
              className="navbar-icon-btn cart-btn"
              onClick={() => navigate("/carrinho")}
              aria-label="Ver carrinho"
            >
              <i className="pi pi-shopping-cart"></i>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            <button
              className="navbar-icon-btn"
              onClick={(e) => menuRef.current?.toggle(e)}
              aria-label="Menu do usuário"
            >
              <i className="pi pi-user"></i>
            </button>
          </div>

          {/* Botão Mobile Menu */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setSidebarVisible(true)}
            aria-label="Abrir menu"
          >
            <i className="pi pi-bars"></i>
          </button>

          {/* Menu Dropdown Usuário */}
          <Menu ref={menuRef} model={userMenuItems} popup />
        </div>
      </nav>

      {/* Sidebar Mobile */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="mobile-sidebar"
        position="right"
        blockScroll
      >
        <div className="mobile-sidebar-content">
          {/* Logo Mobile */}
          <div className="mobile-logo">
            <img
              src="/assets/images/logo/logo_riffhouse_red.png"
              alt="Riffhouse"
            />
          </div>

          {/* Busca Mobile */}
          <form className="mobile-search" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <i className="pi pi-search search-icon"></i>
              <input
                type="search"
                className="search-input"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar produtos"
              />
            </div>
          </form>

          {/* Menu Mobile */}
          <div className="mobile-menu-section">
            <h3 className="mobile-section-title">Menu</h3>
            <nav className="mobile-nav">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="mobile-menu-item"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarVisible(false);
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Conta Mobile */}
          <div className="mobile-menu-section">
            <h3 className="mobile-section-title">Conta</h3>
            <nav className="mobile-nav">
              {userMenuItems.map((item, index) => (
                <button
                  key={index}
                  className="mobile-menu-item"
                  onClick={() => {
                    item.command?.();
                    setSidebarVisible(false);
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Carrinho Mobile */}
          <div className="mobile-menu-section">
            <button
              className="mobile-cart-btn"
              onClick={() => {
                navigate("/carrinho");
                setSidebarVisible(false);
              }}
            >
              <div className="mobile-cart-content">
                <i className="pi pi-shopping-cart"></i>
                <span>Meu Carrinho</span>
              </div>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default TopMenu;
