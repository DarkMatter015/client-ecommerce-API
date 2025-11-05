import { formatCurrency, getItemCountText } from "@/utils/Utils";
import { Button } from "primereact/button";
import type React from "react";

export const CartSummary: React.FC<{
    cartMetrics: { totalItems: number; total: number };
    onFinalize: () => void;
    cartLength: number;
}> = ({
    cartMetrics,
    onFinalize,
    cartLength
}) => (
        <aside className="cart-summary" aria-label="Resumo da compra">
            <div className="summary-sticky">
                <section className="summary-card">
                    <h3>Resumo da Compra</h3>
                    <div className="summary-line">
                        <span>Total ({getItemCountText(cartMetrics.totalItems)})</span>
                        <span>R$ {formatCurrency(cartMetrics.total)}</span>
                    </div>

                    <div className="summary-line">
                        <span>Frete</span>
                        {/* <span>{cartMetrics.frete > 0 ? `R$ ${formatCurrency(cartMetrics.frete)}` : 'Calcular'}</span> */}
                    </div>
                    <div className="summary-divider" role="separator"></div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span className="total-value">
                            R$ {formatCurrency(cartMetrics.total)}
                        </span>
                    </div>
                </section>

                <Button
                    className="btn-default btn-finalize w-full"
                    onClick={onFinalize}
                    disabled={cartLength === 0}
                    aria-label="Finalizar compra"
                >
                    <i className="pi pi-check me-2" aria-hidden="true"></i>
                    Finalizar Compra
                </Button>
            </div>
        </aside>
    );