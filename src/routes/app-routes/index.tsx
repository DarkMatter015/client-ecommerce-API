import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/layouts/require-auth";
import { Layout } from "@/layouts/layout";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import OrdersPage from "@/pages/orders";
import Profile from "@/pages/profile";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="cadastro" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/produto/:id" element={<ProductPage />} />

        <Route path="/carrinho" element={<CartPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/finalizar" element={<CheckoutPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
