import { CartContext } from "@/context/CartContext";
import { use } from "react";

export const useCart = () => {
    const context = use(CartContext);
    if (!context) {
        throw new Error("useCart precisa estar dentro de CartProvider");
    }
    return context;
};
