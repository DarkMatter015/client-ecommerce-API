import React from "react";
import { ItemCartCheckout } from "../ItemCartCheckout";
import { Button } from "primereact/button";
import { RegisterAddressDialog } from "../../Address/RegisterAddressDialog";
import { AddressList } from "../../Address/AddressList";
import { CheckoutPaymentMethod } from "../CheckoutPaymentMethod";
import { Summary } from "../../Summary";
import type { IItem } from "@/commons/types/types";

export const CheckoutContainer: React.FC<{
    cartItems: IItem[] | undefined;
    cartMetrics: any;
    handleAddAddress: () => void;
    handleAddressDialogHide: () => void;
    showAddressDialog: boolean;
    setShowAddressDialog: (show: boolean) => void;
    newAddress: any;
    setNewAddress: (address: any) => void;
    savingAddress: boolean;
    addresses: any[];
    setSelectedAddress: (address: any) => void;
    selectedAddress: any;
    payments: any[];
    paymentMethod: any;
    handleFinalize: () => void;
    handleGoBack: () => void;
    setPaymentMethod: (payment: any) => void;
}> = ({
    cartItems,
    cartMetrics,
    handleFinalize,
    handleGoBack,
    showAddressDialog,
    setShowAddressDialog,
    handleAddressDialogHide,
    newAddress,
    setNewAddress,
    handleAddAddress,
    savingAddress,
    addresses,
    setSelectedAddress,
    selectedAddress,
    payments,
    paymentMethod,
    setPaymentMethod,
}) => {
    return (
        <div className="checkout-container">
            <div className="checkout-details">
                {/* Step 1: Order Items */}
                <section
                    className="checkout-card"
                    aria-labelledby="order-items-heading"
                >
                    <h3 id="order-items-heading">
                        <i
                            className="pi pi-shopping-cart"
                            aria-hidden="true"
                        ></i>
                        Revise seus Itens
                    </h3>
                    <div className="order-item-list">
                        {cartItems?.map((item) => (
                            <ItemCartCheckout key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                <div className="p-grid" style={{ gap: "1.5rem" }}>
                    <div className="p-col-12 p-md-6">
                        <div style={{ marginBottom: "1rem" }}>
                            <Button
                                label="Adicionar Novo Endereço"
                                icon="pi pi-plus"
                                onClick={() => setShowAddressDialog(true)}
                                className="p-button-outlined"
                                style={{ width: "100%" }}
                            />
                        </div>

                        <RegisterAddressDialog
                            showAddressDialog={showAddressDialog}
                            handleAddressDialogHide={handleAddressDialogHide}
                            newAddress={newAddress}
                            setNewAddress={setNewAddress}
                            handleAddAddress={handleAddAddress}
                            savingAddress={savingAddress}
                        />

                        <AddressList
                            addresses={addresses}
                            onSelectAddress={setSelectedAddress}
                            selectedAddress={selectedAddress}
                        />
                    </div>
                    <div className="p-col-12 p-md-6">
                        <CheckoutPaymentMethod
                            payments={payments}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                    </div>
                </div>
            </div>

            <Summary
                cartMetrics={cartMetrics}
                handlePlaceOrder={handleFinalize}
                handleGoBack={handleGoBack}
                selectedAddress={selectedAddress}
                paymentMethod={paymentMethod}
            />
        </div>
    );
};
