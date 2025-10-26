import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";

export function AppRoutes() {
  return (
    <Routes>
        
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

        <Route path="/" element={<Layout />}>
        {/* public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />

          <Route path="/produto/:id" element={<ProductPage />} />

          <Route path="/carrinho" element={<CartPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
            
        </Route>
      </Route>
    </Routes>
  );
}