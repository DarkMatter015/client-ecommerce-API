import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export function RequireAuth() {
    const { authenticated } = useAuth();
    const location = useLocation();

    return authenticated ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}
