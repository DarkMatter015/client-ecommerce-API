import { getItemCountText } from "@/utils/Utils";

export const CartHeader: React.FC<{
    totalItems: number
}> = ({
    totalItems
}) => (
        <div className="cart-products-header">
            <h2>Meu Carrinho</h2>
            <span
                className="cart-count"
                aria-label={`Total de ${getItemCountText(totalItems)}`}
            >
                {getItemCountText(totalItems)}
            </span>
        </div>
    );