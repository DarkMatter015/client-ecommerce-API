import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

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

export const useMenuItems = () => {
    const navigate = useNavigate();
    const { authenticated, handleLogout } = useContext(AuthContext);

    const menuItems: MenuItem[] = [
        { label: "Home", path: "/", hash: "home", icon: "pi pi-home" },
        {
            label: "Produtos",
            path: "/",
            hash: "products",
            icon: "pi pi-shopping-bag",
        },
        {
            label: "Avaliações",
            path: "/",
            hash: "testimonials",
            icon: "pi pi-star",
        },
        {
            label: "Sobre Nós",
            path: "/",
            hash: "about",
            icon: "pi pi-info-circle",
        },
    ];

    const userMenuItems: UserMenuItem[] = authenticated
        ? [
              {
                  label: "Meu Perfil",
                  icon: "pi pi-user",
                  command: () => navigate("/perfil"),
              },
              {
                  label: "Meus Pedidos",
                  icon: "pi pi-box",
                  command: () => navigate("/pedidos"),
              },
              {
                  label: "Sair",
                  icon: "pi pi-sign-out",
                  command: () => handleLogout(),
              },
          ]
        : [
              {
                  label: "Entrar",
                  icon: "pi pi-sign-in",
                  command: () => navigate("/login"),
              },
              {
                  label: "Cadastrar-se",
                  icon: "pi pi-user-plus",
                  command: () => navigate("/cadastro"),
              },
          ];

    return { menuItems, userMenuItems };
};
