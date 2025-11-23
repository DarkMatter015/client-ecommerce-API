import type { IFreightResponse, IItem } from "@/commons/types/types";
import { useRef, useState } from "react";
import { useCallback } from "react";
import type { IFreightRequest } from "@/commons/types/types";
import { calculateFreightByProducts } from "@/services/freight-service";
import { Toast } from "primereact/toast";

export function useFreight(cep: string, produtos: IItem[]) {
    const toast = useRef<Toast | null>(null);
    const [freightsData, setFreightsData] = useState<
        IFreightResponse[] | undefined
    >(undefined);

    const [selectedFreight, setSelectedFreight] =
        useState<IFreightResponse | null>(null);

    const handleCalculateFreight = useCallback(async () => {
        if (cep && cep.length === 8) {
            const cepFormat = cep.replace(/[^0-9]/g, "");

            const freight: IFreightRequest = {
                to: {
                    postal_code: cepFormat,
                },
                products: produtos.map((produto) => ({
                    id: produto.product.id,
                    insurance_value: produto.product.price,
                    quantity: produto.quantity,
                })),
            };

            try {
                const response = await calculateFreightByProducts(freight);

                if (response.success) {
                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: response.message,
                        life: 2000,
                    });

                    console.log(response);

                    setFreightsData(
                        Array.isArray(response?.data)
                            ? (response.data as IFreightResponse[])
                            : undefined
                    );
                } else {
                    if (response.status === 422)
                        toast.current?.show({
                            severity: "error",
                            summary: "Erro ao calcular frete",
                            detail: "CEP Inválido!",
                            life: 2000,
                        });
                }
            } catch (error: any) {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro ao calcular frete",
                    detail: error.message,
                    life: 2000,
                });
            }
        } else {
            toast.current?.show({
                severity: "error",
                summary: "CEP inválido",
                detail: "Por favor, insira um CEP válido de 8 caracteres.",
                life: 2000,
            });
        }
    }, [cep, produtos]);

    return {
        freightsData,
        selectedFreight,
        setSelectedFreight,
        handleCalculateFreight,
        toast,
    };
}
