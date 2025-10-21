import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { LayoutLoginRegister } from "@/components/layout-login-register";

export function AppRoutes() {
  return (
    <Routes>
        
        <Route element={<LayoutLoginRegister />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<Layout />}>
        {/* public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
            
        </Route>
      </Route>
    </Routes>
  );
}