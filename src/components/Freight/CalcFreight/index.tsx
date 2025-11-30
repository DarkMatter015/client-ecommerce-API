import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type React from "react";

import "./CalcFreight.style.css";
import type { IItem } from "@/commons/types/types";
import { FreightList } from "../FreightList";
import { Toast } from "primereact/toast";
import { useFreight } from "@/hooks/useFreight";

export const CalcFreight: React.FC<{
    cep: string;
    setCep: (cep: string) => void;
    produtos: IItem[];
}> = ({ cep, setCep, produtos }) => {
    const { handleCalculateFreight, freightsData, toast } = useFreight(
        cep,
        produtos
    );

    return (
        <>
            <Toast ref={toast} />

            <div className="mb-3 mt-3">
                <label htmlFor="cep" className="form-label">
                    <strong>Calcular Frete e Prazo</strong>
                </label>
                <div className="input-group mb-1">
                    <InputText
                        type="text"
                        id="cep"
                        className="p-inputtext"
                        name="cep"
                        placeholder="Insira seu CEP"
                        value={cep}
                        onChange={(e) => setCep(e.currentTarget.value)}
                        aria-label="CEP"
                    />
                    <Button
                        className="p-button-text"
                        onClick={handleCalculateFreight}
                        aria-label="Calcular frete e prazo"
                    >
                        Calcular
                    </Button>
                </div>
                <a href="#" className="small">
                    Não sei meu CEP
                </a>
            </div>

            {freightsData && freightsData.length > 0 && (
                <FreightList freights={freightsData} />
            )}
        </>
    );
};
