import type { IItem } from "@/commons/types/types";
import { ItemCartCheckout } from "../ItemCartCheckout";

export const CheckoutOrderItems: React.FC<{ cartItems: IItem[] | undefined }> = ({
    cartItems,
}) => {
    return (
        <section
            className="checkout-card"
            aria-labelledby="order-items-heading"
        >
            <h3 id="order-items-heading">
                <i className="pi pi-shopping-cart" aria-hidden="true"></i>
                Revise seus Itens
            </h3>
            <div className="order-item-list">
                {cartItems?.map((item) => (
                    <ItemCartCheckout key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};
