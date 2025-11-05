import type { IAddress } from "@/commons/types/types"

export const CheckoutSelectAddress: React.FC<{
    selectedAddress: IAddress | null,
    handleDeleteAddress: () => void,
    handleOpenAddressDialog: () => void,
    formatAddress: (address: IAddress | null) => string

}> = ({ selectedAddress, handleDeleteAddress, handleOpenAddressDialog, formatAddress }) => {
    return (
        <section className="address-card">
            <div className="address-header">
                <h4>
                <i className="pi pi-map-marker" aria-hidden="true"></i> Endereço de Entrega
                </h4>
                <div className="address-actions">
                <button 
                    className="icon-btn btn-edit" 
                    onClick={handleOpenAddressDialog}
                    aria-label="Gerenciar endereços"
                >
                    <i className="pi pi-pencil" aria-hidden="true"></i>
                </button>
                {selectedAddress && (
                    <button 
                    className="icon-btn btn-delete" 
                    onClick={handleDeleteAddress}
                    aria-label="Remover endereço selecionado"
                    >
                    <i className="pi pi-trash" aria-hidden="true"></i>
                    </button>
                )}
                </div>
            </div>
            <div className="address-content">
                {selectedAddress ? (
                <p className="address-text">{formatAddress(selectedAddress)}</p>
                ) : (
                <p className="no-address">Nenhum endereço selecionado</p>
                )}
            </div>
        </section>
    )
}