import { AuthContext } from "@/context/AuthContext";
import { use } from "react";

export const useAuth = () => {
    const context = use(AuthContext);
    if (!context) {
        throw new Error("useAuth precisa estar dentro de AuthProvider");
    }
    return context;
};
