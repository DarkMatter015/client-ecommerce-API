import type { IFreightResponse, IItem } from "@/commons/types/types";
import { useState } from "react";
import { useCallback } from "react";
import type { IFreightRequest } from "@/commons/types/types";
import { calculateFreightByProducts } from "@/services/freight-service";
import { useToast } from "@/context/hooks/use-toast";

export function useFreight(cep: string, produtos: IItem[]) {
    const { showToast } = useToast();
    const [freightsData, setFreightsData] = useState<
        IFreightResponse[] | undefined
    >(undefined);

    const [selectedFreight, setSelectedFreight] =
        useState<IFreightResponse | null>(null);

    const handleCalculateFreight = useCallback(async () => {
        const cepFormat = cep.replace(/[^0-9]/g, "");
        if (cepFormat && cepFormat.length === 8) {
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
                    showToast(
                        "success",
                        "Sucesso",
                        response.message || "Frete calculado com sucesso!",
                        2000
                    );

                    console.log(response);

                    setFreightsData(
                        Array.isArray(response?.data)
                            ? (response.data as IFreightResponse[])
                            : undefined
                    );
                } else {
                    if (response.status === 422)
                        showToast(
                            "error",
                            "Erro ao calcular frete",
                            "CEP Inválido!",
                            2000
                        );
                }
            } catch (error: any) {
                showToast(
                    "error",
                    "Erro ao calcular frete",
                    error.message,
                    2000
                );
            }
        } else {
            showToast(
                "error",
                "CEP inválido",
                "Por favor, insira um CEP válido de 8 caracteres.",
                2000
            );
        }
    }, [cep, produtos, showToast]);

    return {
        freightsData,
        selectedFreight,
        setSelectedFreight,
        handleCalculateFreight,
    };
}
