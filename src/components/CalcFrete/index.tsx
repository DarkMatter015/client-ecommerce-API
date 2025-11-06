import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import type React from "react"

import "./calcFrete.style.css"

export const CalcFrete: React.FC<{ 
    cep: string,
    setCep: (cep: string) => void,
    handleCalculateCep: () => void
}> = ({
    cep,
    setCep,
    handleCalculateCep, 
  }) => {
    return (
      <div className="mb-3 mt-3">
        <label htmlFor="cep" className="form-label"><strong>Calcular Frete e Prazo</strong></label>
        <div className="input-group mb-1">
          <InputText type="text" id="cep" className="p-inputtext" name="cep" placeholder="Insira seu CEP" value={cep} onChange={(e) => setCep(e.currentTarget.value)} aria-label="CEP" />
          <Button className="p-button-text" onClick={handleCalculateCep} aria-label="Calcular frete e prazo">Calcular</Button>
        </div>
        <a href="#" className="small">Não sei meu CEP</a>
      </div>
    )
  }