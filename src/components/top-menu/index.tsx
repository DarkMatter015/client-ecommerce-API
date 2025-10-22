import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useRef } from "react";

import "@/components/top-menu/index.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<Menu>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
    
  return (
    <>
      <nav className="navbar fixed top-0 start-0 w-full z-3 shadow-2" aria-label="Navegação principal">
        <div className="flex justify-content-between align-items-center m-2">
          <a className="navbar-brand flex align-items-center" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
            <img width="100" src="/assets/images/logo/logo_riffhouse_red.png" alt="Logo Riffhouse"/>
          </a>

          {/* Menu para mobile */}
          <Button
            icon="pi pi-bars"
            className="p-button-text lg:hidden"
            aria-label="Menu navegação"
            onClick={() => setSidebarVisible(true)}
          />

          {/* Menu principal - Desktop */}
          <div className="hidden lg:flex flex-grow-1 justify-content-between align-items-center">
            <ul className="flex list-none m-0 p-0 gap-1 align-items-center">
              <li>
                <Button
                  label="Home"
                  className="p-button-text"
                  onClick={() => navigate('/#home')}
                />
              </li>
              <li>
                <Button
                  label="Produtos"
                  className="p-button-text"
                  onClick={() => navigate('/#produtos')}
                />
              </li>
              <li>
                <Button
                  label="Avaliações"
                  className="p-button-text"
                  onClick={() => navigate('/#testimonials')}
                />
              </li>
              <li>
                <Button
                  label="Sobre Nós"
                  className="p-button-text"
                  onClick={() => navigate('/#about')}
                />
              </li>
            </ul>

            {/* Formulário de busca */}
            <form className="flex align-items-center justify-content-between gap-2 mx-4 header-search-form" role="search">
              <InputText
                name="search"
                className="w-12rem"
                type="search"
                placeholder="Buscar produtos..."
                aria-label="Pesquisar"
              />
              <Button
                icon="pi pi-search"
                className="p-button-text"
                type="submit"
                aria-label="Pesquisar"
              />
            </form>

            {/* Ícones do usuário */}
            <div className="flex align-items-center gap-3">
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-text"
                onClick={() => navigate('/carrinho')}
                badge="0"
                aria-label="Ver carrinho"
              />
              <Button
                icon="pi pi-user"
                className="p-button-text"
                onClick={(e) => menuRef.current?.toggle(e)}
                aria-label="Menu do usuário"
              />
            </div>
          </div>

          {/* Menu dropdown do usuário */}
          <Menu
            ref={menuRef}
            model={[
              {
                label: 'Entrar',
                icon: 'pi pi-sign-in',
                command: () => navigate('/login')
              },
              {
                label: 'Cadastrar-se',
                icon: 'pi pi-user-plus',
                command: () => navigate('/register')
              }
            ]}
            popup
          />
        </div>
      </nav>

      {/* Sidebar para mobile */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="mobile-menu"
        position="right"
        blockScroll
        aria-label="Menu de navegação móvel"
      >
        <div className="flex flex-column gap-3">
          <div className="flex flex-column gap-2">
            <h3>Menu</h3>
            <Button
              label="Home"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/#home'); setSidebarVisible(false); }}
            />
            <Button
              label="Produtos"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/#produtos'); setSidebarVisible(false); }}
            />
            <Button
              label="Avaliações"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/#testimonials'); setSidebarVisible(false); }}
            />
            <Button
              label="Sobre Nós"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/#about'); setSidebarVisible(false); }}
            />
          </div>

          <div className="flex flex-column gap-2">
            <h3>Conta</h3>
            <Button
              icon="pi pi-sign-in"
              label="Entrar"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/login'); setSidebarVisible(false); }}
            />
            <Button
              icon="pi pi-user-plus"
              label="Cadastrar-se"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/register'); setSidebarVisible(false); }}
            />
          </div>

          <div className="flex flex-column gap-2">
            <h3>Carrinho</h3>
            <Button
              icon="pi pi-shopping-cart"
              label="Ver Carrinho"
              badge="0"
              className="p-button-text w-full justify-content-start"
              onClick={() => { navigate('/carrinho'); setSidebarVisible(false); }}
            />
          </div>

          <div className="flex flex-column gap-2">
            <h3>Buscar</h3>
            <form className="flex gap-2 header-search-form" role="search" onSubmit={() => setSidebarVisible(false)}>
              <InputText
                name="search"
                className="w-full"
                type="search"
                placeholder="Buscar produtos..."
                aria-label="Pesquisar"
              />
              <Button
                icon="pi pi-search"
                className="p-button-text"
                type="submit"
                aria-label="Pesquisar"
              />
            </form>
          </div>
        </div>
      </Sidebar>
    </>
    );
};

export default TopMenu;