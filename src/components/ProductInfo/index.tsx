import type { IProduct } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import { InputNumber } from "primereact/inputnumber";
import type React from "react";

import "./productInfo.style.css";

export const ProductInfo: React.FC<{
    product: IProduct,
    pricePerUnit: number,
    quantity: number,
    setQuantity: (quantity: number) => void
}> = ({
    product,
    pricePerUnit,
    quantity,
    setQuantity
}) => {
        return (
            <>
                <div>
                    <h1 className="product-title">{product.name}</h1>
                    <p className="mb-0"><i>{product.name} - {product.category.name}</i></p>
                    <div className="mb-2 h6">
                        <span className="text-warning h4" aria-hidden>★★★★★</span>
                        <span className="sr-only">5 de 5 estrelas</span>
                        <span className="visually-hidden"> +500 avaliações</span>
                    </div>
                    <p>Código Nº: {product.id}</p>
                </div>

                <div className="product-price-section">
                    <div className="product-price">
                        <span className="price-label">Preço:</span>
                        <span className="price-value">R$ {formatCurrency(pricePerUnit)}</span>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label"><strong>Quantidade</strong></label>
                    <InputNumber
                        inputId='quantity'
                        value={quantity}
                        onValueChange={(e) => setQuantity(e.value ?? 1)}
                        showButtons
                        inputClassName="w-6rem"
                        min={1}
                        aria-label="Quantidade"
                    />
                </div>
            </>
        );
    };