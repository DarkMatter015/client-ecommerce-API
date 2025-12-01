import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import type { IItem } from "@/commons/types/types";
import { useCart } from "@/context/hooks/use-cart";
import { useToast } from "@/context/hooks/use-toast";

import "./cart.style.css";

import { CartSummary } from "@/components/Cart/CartSummary";
import { CartHeader } from "@/components/Cart/CartHeader";
import { EmptyCart } from "@/components/Cart/EmptyCart";
import { ItemCart } from "@/components/Cart/ItemCart";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const { cartItems, cartMetrics, deleteItem, handleUpdateQuantity } =
        useCart();

    const handleRemoveItem = (item: IItem) => {
        confirmDialog({
            message: `Deseja realmente remover "${item.product.name}" do carrinho?`,
            header: "Confirmar Remoção",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim, Remover",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: () => {
                deleteItem(item);
                showToast(
                    "info",
                    "Produto Removido",
                    "O produto foi removido do carrinho.",
                    3000
                );
            },
        });
    };

    const handleProductClick = (productId: number) => {
        navigate(`/produto/${productId}`);
    };

    const handleFinalize = () => {
        if (!cartItems || cartItems.length === 0) {
            showToast(
                "warn",
                "Carrinho Vazio",
                "Seu carrinho está vazio. Adicione produtos para continuar.",
                3000
            );
            return;
        }

        navigate("/finalizar", { state: { cartItems } });
    };

    return (
        <div className="cart-page">
            <ConfirmDialog />

            <div className="cart-container">
                <section
                    className="cart-products"
                    aria-label="Produtos no carrinho"
                >
                    <CartHeader
                        totalItems={cartMetrics ? cartMetrics.totalItems : 0}
                    />

                    {cartItems?.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems?.map((item) => (
                                    <ItemCart
                                        key={item.id}
                                        item={item}
                                        handleProductClick={handleProductClick}
                                        handleRemoveItem={handleRemoveItem}
                                        handleUpdateQuantity={
                                            handleUpdateQuantity
                                        }
                                    />
                                ))}
                            </div>

                            <Button
                                outlined
                                severity="secondary"
                                icon="pi pi-arrow-left"
                                label="Continuar Comprando"
                                aria-label="Continuar Comprando"
                                className="btn-continue-shopping"
                                onClick={() => navigate("/")}
                            />
                        </>
                    )}
                </section>

                <CartSummary onFinalize={handleFinalize} />
            </div>
        </div>
    );
};

export default CartPage;
