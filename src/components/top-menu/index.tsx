import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import "./top-menu.style.css";

import { AutoComplete } from 'primereact/autocomplete';
import { getAllProducts } from '@/services/product-service';
import type { Product } from '@/commons/types/product';

interface ProductGroup {
  label: string;
  items: Product[];
}

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<Menu>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const scrollToSection = (hash: string) => {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.hash) {
      // Remove o # do início e tenta rolar até a seção
      const hash = location.hash.replace('#', '');
      scrollToSection(hash);
    } else {
      // Se não houver hash, rola para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);
  
  const cartItemsCount = 5;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductGroup[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Templates and search method following PrimeReact TemplateDemo pattern
  const panelFooterTemplate = () => {
    const total = filteredProducts.reduce((sum, g) => sum + g.items.length, 0);
    if (!total) return null;
    return (
      <div className="py-2 px-3">{total} resultados encontrados</div>
    );
  };

  const itemTemplate = (item: Product | null) => {
    if (!item) return null;
    return (
      <div className="flex align-items-center">
        <img
          alt={item.name}
          src={item.urlImage}
          className="search-item-image"
          style={{ width: 36, height: 36, marginRight: 8 }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
    );
  };

  const selectedItemTemplate = (item: Product | null) => {
    return item ? `${item.name}` : '';
  };

  const optionGroupTemplate = (option: ProductGroup) => {
    return (
      <div style={{ fontWeight: 600, padding: '0.25rem 0.5rem' }}>
        <i className="pi pi-tag" style={{ marginRight: '0.5rem' }}></i>
        {option.label}
      </div>
    );
  };

  // search method emulating network latency (matches TemplateDemo)
  let searchTimeout: number | undefined;
  const search = (event: { query: string }) => {
    window.clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => {
      const q = (event.query || '').toLowerCase();
      let filtered: Product[] = [];
      if (!q.trim().length) {
        filtered = [...products];
      } else {
        filtered = products.filter(p => p.name.toLowerCase().includes(q));
      }

      // group by category
      const groups: ProductGroup[] = [];
      const map = new Map<string, Product[]>();
      filtered.forEach(p => {
        const cat = p.category?.name ?? 'Outros';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(p);
      });
      for (const [label, items] of map.entries()) {
        groups.push({ label, items });
      }

      setFilteredProducts(groups);
    }, 250);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await getAllProducts();
        if (!mounted) return;
        setProducts(resp.content || []);
      } catch (err) {
        console.error('Erro ao carregar produtos para autocomplete', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  

  const menuItems = [
    { label: "Home", path: "/", hash: "home", icon: "pi pi-home" },
    { label: "Produtos", path: "/", hash: "products", icon: "pi pi-shopping-bag" },
    { label: "Avaliações", path: "/", hash: "testimonials", icon: "pi pi-star" },
    { label: "Sobre Nós", path: "/", hash: "about", icon: "pi pi-info-circle" }
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
                  <Link
                    to={`${item.path}#${item.hash}`}
                    className="menu-link"
                    onClick={(e) => {
                      if (location.pathname === item.path) {
                        e.preventDefault();
                        scrollToSection(item.hash);
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Barra de Busca Desktop */}
          <form className="navbar-search-desktop">
            

            <div className="search-container">
              <AutoComplete
                field="name"
                value={selectedProduct}
                suggestions={filteredProducts as any}
                completeMethod={search}
                onChange={(e: any) => {
                  setSelectedProduct(e.value);
                  if (e.value && (e.value as Product).id) {
                    navigate(`/produto/${(e.value as Product).id}`);
                  }
                }}
                itemTemplate={itemTemplate}
                selectedItemTemplate={selectedItemTemplate}
                panelFooterTemplate={panelFooterTemplate}
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={optionGroupTemplate as any}
                placeholder="Buscar produtos..."
                showEmptyMessage={true}
                emptyMessage="Nenhum produto encontrado"
                loadingIcon="pi pi-spin pi-spinner"
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
          <div className="mobile-search">
            <AutoComplete
              field="name"
              value={selectedProduct}
              suggestions={filteredProducts as any}
              completeMethod={search}
              onChange={(e: any) => {
                setSelectedProduct(e.value);
                if (e.value && (e.value as Product).id) {
                  navigate(`/produto/${(e.value as Product).id}`);
                  setSidebarVisible(false);
                }
              }}
              itemTemplate={itemTemplate}
              selectedItemTemplate={selectedItemTemplate}
              panelFooterTemplate={panelFooterTemplate}
              optionGroupLabel="label"
              optionGroupChildren="items"
              optionGroupTemplate={optionGroupTemplate as any}
              placeholder="Buscar produtos..."
              showEmptyMessage={true}
              emptyMessage="Nenhum produto encontrado"
              loadingIcon="pi pi-spin pi-spinner"
              className="w-full"
            />
          </div>

          {/* Menu Mobile */}
          <div className="mobile-menu-section">
            <h3 className="mobile-section-title">Menu</h3>
            <nav className="mobile-nav">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={`${item.path}#${item.hash}`}
                  className="mobile-menu-item"
                  onClick={(e) => {
                    if (location.pathname === item.path) {
                      e.preventDefault();
                      scrollToSection(item.hash);
                    }
                    setSidebarVisible(false);
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
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
