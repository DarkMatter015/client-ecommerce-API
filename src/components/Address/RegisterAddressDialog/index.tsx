import type { IAddress } from "@/commons/types/types";
import { validateCep } from "@/services/cep-service";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import type React from "react";

export const RegisterAddressDialog: React.FC<{
    showAddressDialog: boolean;
    handleAddressDialogHide: () => void;
    newAddress: Partial<IAddress>;
    setNewAddress: React.Dispatch<React.SetStateAction<Partial<IAddress>>>;
    handleAddAddress: () => void;
    savingAddress: boolean;
}> = ({
    showAddressDialog,
    handleAddressDialogHide,
    newAddress,
    setNewAddress,
    handleAddAddress,
    savingAddress,
}) => {
    const handleBlurCep = async (cep: string) => {
        if (cep.length === 9) {
            try {
                cep = cep.replace(/[^0-9]/g, '')
                const response = await validateCep(cep);
                if (response.success) {
                    const data = response.data as IAddress;

                    setNewAddress({
                        ...newAddress,
                        cep: data?.cep,
                        neighborhood: data?.neighborhood,
                        street: data?.street,
                        city: data?.city,
                        state: data?.state,
                    });
                }
            } catch (error) {
                console.error("Erro ao validar CEP:", error);
            }
        } else {
            alert("CEP inválido");
        }
    };

    return (
        <Dialog
            visible={showAddressDialog}
            onHide={handleAddressDialogHide}
            header="Adicionar Novo Endereço"
            modal
            style={{ width: "90vw", maxWidth: "500px" }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div>
                    <label
                        htmlFor="street"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                        }}
                    >
                        Rua *
                    </label>
                    <InputText
                        disabled
                        id="street"
                        value={newAddress.street || ""}
                        onChange={(e) =>
                            setNewAddress({
                                ...newAddress,
                                street: e.target.value,
                            })
                        }
                        placeholder="Nome da rua"
                        style={{ width: "100%" }}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                    }}
                >
                    <div>
                        <label
                            htmlFor="number"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                            }}
                        >
                            Número *
                        </label>
                        <InputNumber
                            id="number"
                            value={newAddress.number || undefined}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    number: Number(e.value),
                                })
                            }
                            placeholder="Número"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="complement"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                            }}
                        >
                            Complemento
                        </label>
                        <InputText
                            id="complement"
                            value={newAddress.complement || ""}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    complement: e.target.value,
                                })
                            }
                            placeholder="Apto, bloco..."
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="neighborhood"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                        }}
                    >
                        Bairro *
                    </label>
                    <InputText
                        disabled
                        id="neighborhood"
                        value={newAddress.neighborhood || ""}
                        onChange={(e) =>
                            setNewAddress({
                                ...newAddress,
                                neighborhood: e.target.value,
                            })
                        }
                        placeholder="Bairro"
                        style={{ width: "100%" }}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "1rem",
                    }}
                >
                    <div>
                        <label
                            htmlFor="city"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                            }}
                        >
                            Cidade *
                        </label>
                        <InputText
                            disabled
                            id="city"
                            value={newAddress.city || ""}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    city: e.target.value,
                                })
                            }
                            placeholder="Cidade"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="state"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "600",
                            }}
                        >
                            Estado *
                        </label>
                        <InputText
                            disabled
                            id="state"
                            value={newAddress.state || ""}
                            onChange={(e) =>
                                setNewAddress({
                                    ...newAddress,
                                    state: e.target.value.toUpperCase(),
                                })
                            }
                            placeholder="UF"
                            maxLength={2}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="cep"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                        }}
                    >
                        CEP *
                    </label>
                    <InputMask
                        id="cep"
                        value={newAddress.cep || undefined}
                        onChange={(e) => {
                            if (e.target.value)
                                setNewAddress({
                                    ...newAddress,
                                    cep: e.target.value,
                                });
                        }}
                        onBlur={(e) => handleBlurCep(e.target.value)}
                        mask="99999-999"
                        placeholder="00000-000"
                        style={{ width: "100%" }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <Button
                        label="Cancelar"
                        onClick={handleAddressDialogHide}
                        className="p-button-secondary"
                        style={{ flex: 1 }}
                    />
                    <Button
                        label="Salvar Endereço"
                        onClick={handleAddAddress}
                        loading={savingAddress}
                        disabled={savingAddress}
                        style={{ flex: 1 }}
                    />
                </div>
            </div>
        </Dialog>
    );
};
