import { formatCurrency, getItemCountText } from "@/utils/Utils"
import { Button } from "primereact/button"
import type React from "react"
import "./summary.style.css"
import { CalcFreight } from "../Freight/CalcFreight"
import { use } from "react"
import { CartContext } from "@/context/CartContext"

export const Summary: React.FC<{
  handlePlaceOrder: () => void,
  handleGoBack: () => void,
  selectedAddress: any,
  paymentMethod: any
}> = ({
  handlePlaceOrder,
  handleGoBack,
  selectedAddress,
  paymentMethod
}) => {
    const { cartMetrics, cartItems, freight } = use(CartContext);
    return (
      <aside className="summary">
        <div className="summary-sticky">
          <section className="checkout-card" aria-labelledby="summary-heading">
            <h3 id="summary-heading">Resumo do Pedido</h3>
            <div className="summary-line">
              <span>Subtotal ({getItemCountText(cartMetrics?.totalItems || 0)})</span>
            </div>
            <div className="summary-line">
              {cartMetrics && cartMetrics?.totalItems > 0 && (
                <div className="cart-summary-line">
                    <CalcFreight
                        cep={selectedAddress?.cep}
                        setCep={() => {}}
                        produtos={cartItems || []}
                    />
                </div>
              )}
            </div>
            <div className="summary-divider" role="separator"></div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-value">R$ {formatCurrency((cartMetrics?.total || 0) + (cartMetrics?.freightValue || 0))}</span>
            </div>
            <Button
              className="btn-default btn-place-order w-full"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || !paymentMethod || !freight}
              aria-label="Confirmar e Pagar o pedido"
            >
              <i className="pi pi-check-circle me-2" aria-hidden="true"></i>
              Confirmar e Pagar
            </Button>
            <Button
              className="btn-gray w-full mt-2"
              onClick={handleGoBack}
              aria-label="Voltar para o carrinho"
            >
              <i className="pi pi-arrow-left me-2" aria-hidden="true"></i>
              Voltar para o Carrinho
            </Button>
          </section>
        </div>
      </aside>
    )
  }