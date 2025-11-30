import type { IProduct } from "@/commons/types/types";
import { Link } from "react-router-dom";
import "./card-product.style.css";
import React, { use, useCallback, useRef } from "react";
import { CartContext } from "@/context/CartContext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

export const CardProduct: React.FC<{
    product: IProduct;
}> = ({ product }) => {
    const { addItem } = use(CartContext);
    const toast = useRef<Toast | null>(null);

    const handleaAddToCart = useCallback(
        (product: IProduct, quantity: number) => {
            addItem({
                product,
                quantity,
            });
            toast.current?.show({
                severity: "success",
                summary: "Adicionado",
                detail: `${product.name} adicionado ao carrinho`,
                life: 2000,
            });
        },
        [addItem]
    );

    return (
        <article key={product.id} className="card-product">
            <Toast ref={toast} />
            <Link
                to={`/produto/${product.id}`}
                className="card-image text-center"
                title={product.name}
                data-id={product.id}
            >
                <img
                    src={product.urlImage}
                    className="img-fluid"
                    alt={product.name}
                />
            </Link>
            <div className="card-body text-center">
                <div className="text-warning">
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <span className="text-sm"> (+500)</span>
                </div>

                <h3 className="card-title">{product.name}</h3>
                <h4 className="mt-1 mb-0">
                    <span className="text-success">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    <small> à vista</small>
                </h4>
                <p className="card-text">
                    <small>
                        ou em até
                        <br />
                        12x sem juros
                    </small>
                </p>
                <div className="div-buttons">
                    <Button rounded raised severity="success">
                        <Link
                            to={`/produto/${product.id}`}
                            className="btn-link-product"
                            data-id={product.id}
                        >
                            Ver Produto
                        </Link>
                    </Button>

                    <Button
                        data-id={product.id}
                        outlined
                        rounded
                        icon="pi pi-cart-plus"
                        onClick={() => handleaAddToCart(product, 1)}
                        severity="success"
                    />
                </div>
            </div>
        </article>
    );
};
