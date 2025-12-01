import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.style.css";
import { getAllPaymentsPageable } from "@/services/payment-service";
import type { IAddress, IPayment } from "@/commons/types/types";
import {
    createAddress,
    getAllAddressesPageable,
} from "@/services/address-service";
import { postOrder } from "@/services/order-service";
import { CheckoutContainer } from "@/components/Checkout/CheckoutContainer";
import { useCart } from "@/context/hooks/use-cart";
import { useToast } from "@/context/hooks/use-toast";

const CheckoutPage: React.FC = () => {
    const { cartItems, freight } = useCart();

    const [payments, setPayments] = useState<IPayment[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<null>(null);

    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(
        null
    );

    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<IAddress>>({
        street: "",
        number: undefined,
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
    });
    const [savingAddress, setSavingAddress] = useState(false);

    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate("/carrinho");
            return;
        }

        const fetchPayments = async () => {
            try {
                const response = await getAllPaymentsPageable(0, 10);
                if (response) {
                    setPayments(response.content);
                }
            } catch (err) {
                console.error("Erro ao buscar pagamentos:", err);
            }
        };

        const fetchAddress = async () => {
            try {
                const response = await getAllAddressesPageable(0, 10);
                if (response) {
                    setAddresses(response.content);
                }
            } catch (err) {
                console.error("Erro ao buscar endereços:", err);
            }
        };

        fetchPayments();
        fetchAddress();
    }, [
        cartItems,
        navigate,
        selectedAddress,
        setShowAddressDialog,
        setAddresses,
    ]);

    const handlePlaceOrder = async () => {
        try {
            const response = await postOrder(
                cartItems,
                selectedAddress,
                paymentMethod,
                freight?.id || null
            );

            if (response?.status != 201) {
                throw new Error("Erro ao realizar o pedido");
            }

            console.log("Pedido realizado:", {
                cartItems,
                selectedAddress,
                paymentMethod,
            });

            showToast(
                "success",
                "Pedido Realizado com sucesso!!",
                "Você será redirecionado para a página de pedidos ...",
                3000
            );

            setTimeout(() => {
                navigate("/pedidos");
            }, 2000);
        } catch (error) {
            console.error("Erro ao realizar o pedido:", error);
        }
    };

    const handleGoBack = () => {
        navigate("/carrinho");
    };

    const handleFinalize = () => {
        if (!selectedAddress) {
            showToast(
                "warn",
                "Endereço Necessário",
                "Por favor, adicione um endereço de entrega."
            );
            return;
        }
        if (!paymentMethod) {
            showToast(
                "warn",
                "Método de Pagamento Necessário",
                "Por favor, selecione um método de pagamento."
            );
            return;
        }
        if (!freight) {
            showToast(
                "warn",
                "Frete Necessário",
                "Por favor, selecione um frete."
            );
            return;
        }

        handlePlaceOrder();
    };

    const handleAddAddress = async () => {
        if (
            !newAddress.street ||
            !newAddress.number ||
            !newAddress.city ||
            !newAddress.state ||
            !newAddress.cep
        ) {
            showToast(
                "warn",
                "Campos Obrigatórios",
                "Preencha todos os campos obrigatórios."
            );
            return;
        }

        try {
            setSavingAddress(true);
            const response = await createAddress(newAddress as IAddress);
            if (response) {
                setAddresses([...addresses, response]);
                setSelectedAddress(response);
                setShowAddressDialog(false);
                setNewAddress({
                    street: "",
                    number: undefined,
                    complement: "",
                    neighborhood: "",
                    city: "",
                    state: "",
                    cep: "",
                });
                showToast(
                    "success",
                    "Endereço Adicionado",
                    "Endereço adicionado com sucesso!"
                );
            }
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            showToast(
                "error",
                "Erro",
                "Erro ao adicionar o endereço. Tente novamente.",
                3000
            );
        } finally {
            setSavingAddress(false);
        }
    };

    const handleAddressDialogHide = () => {
        setShowAddressDialog(false);
        setNewAddress({
            street: "",
            number: undefined,
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            cep: "",
        });
    };

    return (
        <div className="checkout-page">
            <CheckoutContainer
                cartItems={cartItems}
                handleAddAddress={handleAddAddress}
                handleAddressDialogHide={handleAddressDialogHide}
                handleFinalize={handleFinalize}
                handleGoBack={handleGoBack}
                paymentMethod={paymentMethod}
                payments={payments}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setPaymentMethod={setPaymentMethod}
                showAddressDialog={showAddressDialog}
                addresses={addresses}
                savingAddress={savingAddress}
                setNewAddress={setNewAddress}
                newAddress={newAddress}
                setShowAddressDialog={setShowAddressDialog}
            />
        </div>
    );
};

export default CheckoutPage;
