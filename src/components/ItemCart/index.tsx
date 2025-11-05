import type { IItem } from "@/commons/types/types";

import { formatCurrency } from "@/utils/Utils";

export const ItemCart: React.FC<{
    item: IItem,
    handleProductClick: (productId: number) => void,
    handleRemoveItem: (item: IItem) => void,
    handleUpdateQuantity: (itemId: number, newQuantity: number) => void
}> =
    ({
        item,
        handleProductClick,
        handleRemoveItem,
        handleUpdateQuantity
    }) => {
        return (
            <article key={item.id} className="cart-item">
                <button
                    className="cart-item-image"
                    onClick={() => handleProductClick(item.product.id)}
                    aria-label={`Ver detalhes de ${item.product.name}`}
                >
                    <img src={item.product.urlImage} alt={item.product.name} />
                </button>

                <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <div className="cart-item-info">
                        {item.product.category.name && (
                            <span className="cart-item-meta">
                                <strong>Categoria:</strong> {item.product.category.name}
                            </span>
                        )}
                    </div>
                    <div className="cart-item-price-unit">
                        R$ {formatCurrency(item.product.price)}
                        <span className="per-unit">por unidade</span>
                    </div>
                </div>

                <div className="cart-item-actions">
                    <div className="cart-item-price">
                        <strong>R$ {formatCurrency(item.totalPrice)}</strong>
                    </div>

                    <div
                        className="quantity-control"
                        role="group"
                        aria-label="Controle de quantidade"
                    >
                        <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                        >
                            <i className="pi pi-minus" aria-hidden="true"></i>
                        </button>
                        <input
                            type="number"
                            className="quantity-input"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                                handleUpdateQuantity(
                                    item.id,
                                    Math.max(1, Number(e.target.value) || 1)
                                )
                            }
                            aria-label={`Quantidade de ${item.product.name}`}
                        />
                        <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                        >
                            <i className="pi pi-plus" aria-hidden="true"></i>
                        </button>
                    </div>

                    <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item)}
                        aria-label={`Remover ${item.product.name} do carrinho`}
                    >
                        <i className="pi pi-trash" aria-hidden="true"></i> Remover
                    </button>
                </div>
            </article>
        );
    };