import { formatCurrency, getItemCountText } from "@/utils/Utils"
import { Button } from "primereact/button"

export const CheckoutSummary: React.FC<{
  cartMetrics: any,
  handlePlaceOrder: () => void,
  handleGoBack: () => void,
  selectedAddress: any,
  paymentMethod: any
}> = ({
  cartMetrics,
  handlePlaceOrder,
  handleGoBack,
  selectedAddress,
  paymentMethod
}) => {
    return (
      <aside className="checkout-summary">
        <div className="summary-sticky">
          <section className="checkout-card" aria-labelledby="summary-heading">
            <h3 id="summary-heading">Resumo do Pedido</h3>
            <div className="summary-line">
              <span>Subtotal ({getItemCountText(cartMetrics.totalItems)})</span>
            </div>
            <div className="summary-line">
              <span>Frete</span>
              {/* <span>R$ {formatCurrency(frete)}</span> */}
            </div>
            <div className="summary-divider" role="separator"></div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-value">R$ {formatCurrency(cartMetrics.total)}</span>
            </div>
            <Button
              className="btn-default btn-place-order w-full"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || !paymentMethod}
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