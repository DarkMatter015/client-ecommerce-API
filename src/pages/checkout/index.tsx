import React, { use, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./checkout.style.css";
import { getAllPaymentsPageable } from "@/services/payment-service";
import type { IAddress, IPayment } from "@/commons/types/types";
import { CartContext } from "@/context/CartContext";
import {
    getAllAddressesPageable,
    createAddress,
} from "@/services/address-service";
import { postOrder } from "@/services/order-service";
import { CheckoutContainer } from "@/components/Checkout/CheckoutContainer";

const TOAST_MESSAGES = {
    noAddress: {
        severity: "warn" as const,
        summary: "Endereço Necessário",
        detail: "Por favor, adicione um endereço de entrega.",
        life: 3000,
    },
    noPayment: {
        severity: "warn" as const,
        summary: "Método de Pagamento",
        detail: "Por favor, selecione um método de pagamento.",
        life: 3000,
    },
    orderSuccess: {
        severity: "success" as const,
        summary: "Compra Finalizada",
        detail: "Seu pedido foi realizado com sucesso!",
        life: 4000,
    },
    addressDeleted: {
        severity: "info" as const,
        summary: "Endereço Removido",
        detail: "O endereço foi removido com sucesso.",
        life: 3000,
    },
    addressSaved: {
        severity: "success" as const,
        summary: "Endereço Salvo",
        detail: "Endereço salvo com sucesso!",
        life: 3000,
    },
} as const;

const CheckoutPage: React.FC = () => {
    const { cartItems, cartMetrics, cleanCart } = use(CartContext);

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
    const toast = useRef<Toast>(null);

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
    }, [cartItems, navigate]);

    const showToast = useCallback((type: keyof typeof TOAST_MESSAGES) => {
        toast.current?.show(TOAST_MESSAGES[type]);
    }, []);

    const handlePlaceOrder = async () => {
        try {
            const response = await postOrder(
                cartItems,
                selectedAddress,
                paymentMethod
            );

            if (response?.status != 201) {
                throw new Error("Erro ao realizar o pedido");
            }

            console.log("Pedido realizado:", {
                cartItems,
                selectedAddress,
                paymentMethod,
            });

            toast.current?.show({
                severity: "success",
                summary: "Pedido Confirmado!",
                detail: "Seu pedido foi realizado com sucesso e em breve será enviado.",
                life: 3000,
            });

            cleanCart();

            setTimeout(() => {
                navigate("/pedidos");
            }, 3000);
        } catch (error) {
            console.error("Erro ao realizar o pedido:", error);
        }
    };

    const handleGoBack = () => {
        navigate("/carrinho");
    };

    const handleFinalize = () => {
        if (!selectedAddress) {
            showToast("noAddress");
            return;
        }
        if (!paymentMethod) {
            showToast("noPayment");
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
            toast.current?.show({
                severity: "warn",
                summary: "Campos Obrigatórios",
                detail: "Preencha todos os campos obrigatórios.",
                life: 3000,
            });
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
                showToast("addressSaved");
            }
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao adicionar o endereço. Tente novamente.",
                life: 3000,
            });
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
            <Toast ref={toast} />

            <CheckoutContainer
                cartItems={cartItems}
                cartMetrics={cartMetrics}
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
