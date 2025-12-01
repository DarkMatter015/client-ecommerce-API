import React from "react";
import { Button } from "primereact/button";
import { RegisterAddressDialog } from "../../Address/RegisterAddressDialog";
import { AddressList } from "../../Address/AddressList";
import { CheckoutPaymentMethod } from "../CheckoutPaymentMethod";
import { Summary } from "../../Summary";
import type { IItem } from "@/commons/types/types";
import { CheckoutOrderItems } from "../CheckoutorderItems";

export const CheckoutContainer: React.FC<{
    cartItems: IItem[] | undefined;
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

                <CheckoutOrderItems cartItems={cartItems} />

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
                handlePlaceOrder={handleFinalize}
                handleGoBack={handleGoBack}
                selectedAddress={selectedAddress}
                paymentMethod={paymentMethod}
            />
        </div>
    );
};
