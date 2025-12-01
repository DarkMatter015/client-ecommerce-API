import type React from "react";

import "./CalcFreight.style.css";
import type { IItem } from "@/commons/types/types";
import { FreightList } from "../FreightList";
import { useFreight } from "@/hooks/useFreight";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";

export const CalcFreight: React.FC<{
    cep: string;
    setCep: (cep: string) => void;
    produtos: IItem[];
}> = ({ cep, setCep, produtos }) => {
    const { handleCalculateFreight, freightsData } = useFreight(cep, produtos);

    return (
        <>
            <div className="mb-3 mt-3 container-input">
                <label htmlFor="cep" className="form-label">
                    <strong>Calcular Frete e Prazo</strong>
                </label>
                <div className="input-group mb-1">
                    <InputMask
                        type="text"
                        id="cep"
                        className="p-inputtext"
                        name="cep"
                        placeholder="Insira seu CEP"
                        value={cep}
                        onChange={(e) => setCep(e.target.value || "")}
                        mask="99999-999"
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
