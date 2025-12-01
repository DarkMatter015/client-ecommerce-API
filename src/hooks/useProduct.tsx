import type { IProduct } from "@/commons/types/types";
import { useCart } from "@/context/hooks/use-cart";
import { useNavigate } from "react-router-dom";

export function useProduct() {

    const { addItem } = useCart();
    const navigate = useNavigate();
    
    const handleBuyProduct = (produto: IProduct, quantity: number) => {
        addItem({product: produto, quantity: quantity}, false);
        navigate("/carrinho");
    }

    const handleAddToCart = (produto: IProduct, quantity: number) => {
        addItem({product: produto, quantity: quantity});
    }

    return {
        handleBuyProduct,
        handleAddToCart
    };
}