import type { IAddress } from "@/commons/types/types";
import { useToast } from "@/context/hooks/use-toast";
import { validateCep } from "@/services/cep-service";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import type React from "react";
import { useState } from "react";

interface FormErrors {
    cep?: string;
    number?: string;
}

type FieldStatus = "empty" | "touched" | "valid";

interface FieldStatusMap {
    cep: FieldStatus;
    number: FieldStatus;
    complement: FieldStatus;
}

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
    const { showToast } = useToast();
    const [errors, setErrors] = useState<FormErrors>({});
    const [fieldStatus, setFieldStatus] = useState<FieldStatusMap>({
        cep: "empty",
        number: "empty",
        complement: "empty",
    });
    const [isValidatingCep, setIsValidatingCep] = useState(false);

    // Validação de CEP
    const validateCepField = (cep: string): string | undefined => {
        if (!cep) return "CEP é obrigatório";
        const cleanCep = cep.replace(/[^0-9]/g, "");
        if (cleanCep.length !== 8) {
            return "CEP deve conter 8 dígitos";
        }
        return undefined;
    };

    // Verifica se CEP está completamente preenchido
    const isCepComplete = (): boolean => {
        const cleanCep = (newAddress.cep || "").replace(/[^0-9]/g, "");
        return cleanCep.length === 8;
    };

    // Validação de Número
    const validateNumberField = (
        number: number | undefined
    ): string | undefined => {
        if (number === undefined || number === null)
            return "Número é obrigatório";
        if (number <= 0) return "Número deve ser maior que zero";
        return undefined;
    };

    // Obter estilos baseado no status
    const getFieldStyles = (
        status: FieldStatus,
        hasError: boolean
    ): React.CSSProperties => {
        if (hasError && status === "touched") {
            return {
                borderColor: "#dc3545",
                backgroundColor: "#fff5f5",
                borderWidth: "2px",
            };
        }
        if (status === "valid") {
            return {
                borderColor: "#28a745",
                backgroundColor: "#f0fff4",
                borderWidth: "2px",
            };
        }
        if (status === "empty") {
            return {
                borderColor: "#ccc",
                backgroundColor: "#f8f9fa",
                borderWidth: "1px",
            };
        }
        // touched sem erro
        return {
            borderColor: "#ffc107",
            backgroundColor: "#fffbf0",
            borderWidth: "2px",
        };
    };

    // Ícone para cada estado
    const getStatusIcon = (status: FieldStatus, hasError: boolean) => {
        if (hasError && status === "touched") {
            return (
                <i
                    className="pi pi-times-circle"
                    style={{
                        color: "#dc3545",
                        fontSize: "1.2rem",
                    }}
                ></i>
            );
        }
        if (status === "valid") {
            return (
                <i
                    className="pi pi-check-circle"
                    style={{
                        color: "#28a745",
                        fontSize: "1.2rem",
                    }}
                ></i>
            );
        }
        return null;
    };

    const handleSearchCep = async () => {
        const cep = newAddress.cep || "";
        const error = validateCepField(cep);

        if (error) {
            setFieldStatus((prev) => ({ ...prev, cep: "touched" }));
            setErrors({ ...errors, cep: error });
            showToast("warn", "CEP Inválido", error);
            return;
        }

        // CEP é válido, fazer requisição
        try {
            setIsValidatingCep(true);
            const cleanCep = cep.replace(/[^0-9]/g, "");
            const response = await validateCep(cleanCep);

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
                setFieldStatus((prev) => ({ ...prev, cep: "valid" }));
                setErrors((prev) => ({ ...prev, cep: undefined }));
                showToast(
                    "success",
                    "CEP Validado",
                    "Endereço preenchido automaticamente"
                );
            } else {
                setFieldStatus((prev) => ({ ...prev, cep: "touched" }));
                setErrors((prev) => ({
                    ...prev,
                    cep: "CEP não encontrado ou é inválido",
                }));
                showToast(
                    "error",
                    "Erro ao buscar CEP",
                    "CEP não encontrado ou é inválido"
                );
            }
        } catch {
            const errorMsg = "CEP não encontrado ou é inválido";
            setFieldStatus((prev) => ({ ...prev, cep: "touched" }));
            setErrors((prev) => ({ ...prev, cep: errorMsg }));
            showToast("error", "Erro ao buscar CEP", errorMsg);
        } finally {
            setIsValidatingCep(false);
        }
    };

    const handleBlurNumber = () => {
        const error = validateNumberField(newAddress.number);

        if (error) {
            setFieldStatus((prev) => ({ ...prev, number: "touched" }));
            setErrors((prev) => ({ ...prev, number: error }));
        } else {
            setFieldStatus((prev) => ({ ...prev, number: "valid" }));
            setErrors((prev) => ({ ...prev, number: undefined }));
        }
    };

    const handleChangeCep = (value: string) => {
        setNewAddress({
            ...newAddress,
            cep: value,
        });
        // Limpar erro ao usuário começar a editar
        if (errors.cep) {
            setErrors((prev) => ({ ...prev, cep: undefined }));
        }
    };

    const handleChangeNumber = (value: number | null) => {
        setNewAddress({
            ...newAddress,
            number: value ? Number(value) : undefined,
        });
        // Limpar erro ao usuário começar a editar
        if (errors.number) {
            setErrors((prev) => ({ ...prev, number: undefined }));
        }
    };

    const handleChangeComplement = (value: string) => {
        setNewAddress({
            ...newAddress,
            complement: value,
        });
        // Atualizar status do complement
        if (value) {
            setFieldStatus((prev) => ({ ...prev, complement: "valid" }));
        } else if (fieldStatus.complement === "valid") {
            setFieldStatus((prev) => ({ ...prev, complement: "empty" }));
        }
    };

    const handleDialogHide = () => {
        setErrors({});
        setFieldStatus({
            cep: "empty",
            number: "empty",
            complement: "empty",
        });
        handleAddressDialogHide();
    };

    const cepStatus = getFieldStyles(fieldStatus.cep, !!errors.cep);
    const numberStatus = getFieldStyles(fieldStatus.number, !!errors.number);
    const complementStatus = getFieldStyles(fieldStatus.complement, false);

    return (
        <Dialog
            visible={showAddressDialog}
            onHide={handleDialogHide}
            header="Adicionar Novo Endereço"
            modal
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                {/* CEP - PRIMEIRO CAMPO EM DESTAQUE */}
                <div
                    style={{
                        padding: "1rem",
                        backgroundColor: "#f0f8ff",
                        borderRadius: "8px",
                        border: "2px solid #007bff",
                    }}
                >
                    <label
                        htmlFor="cep"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                        }}
                    >
                        CEP *{" "}
                        <span style={{ color: "#007bff", fontWeight: "bold" }}>
                            (Preencha primeiro)
                        </span>
                    </label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <div style={{ flex: 1, position: "relative" }}>
                            <InputMask
                                id="cep"
                                value={(newAddress.cep || "") as string}
                                onChange={(e) =>
                                    handleChangeCep(e.target.value || "")
                                }
                                mask="99999-999"
                                placeholder="00000-000"
                                style={{
                                    ...cepStatus,
                                    width: "100%",
                                    padding: "0.5rem",
                                    paddingRight: isValidatingCep
                                        ? "2.5rem"
                                        : "0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "1rem",
                                }}
                                disabled={isValidatingCep}
                            />
                            {isValidatingCep && (
                                <i
                                    className="pi pi-spin pi-spinner"
                                    style={{
                                        position: "absolute",
                                        right: "0.75rem",
                                        top: "50%",
                                        color: "#007bff",
                                        fontSize: "1.2rem",
                                        animation: "spin 1s linear infinite",
                                    }}
                                ></i>
                            )}
                        </div>
                        <Button
                            icon={
                                isValidatingCep
                                    ? "pi pi-spin pi-spinner"
                                    : "pi pi-search"
                            }
                            onClick={handleSearchCep}
                            loading={isValidatingCep}
                            disabled={isValidatingCep || !isCepComplete()}
                            className="p-button-primary"
                            title="Buscar CEP"
                            style={{
                                padding: "0.5rem 1rem",
                                minWidth: "120px",
                            }}
                            label={isValidatingCep ? "" : "Buscar"}
                        />
                        {!isValidatingCep &&
                            getStatusIcon(fieldStatus.cep, !!errors.cep)}
                    </div>
                    {errors.cep && fieldStatus.cep === "touched" && (
                        <div
                            style={{
                                color: "#dc3545",
                                fontSize: "0.85rem",
                                marginTop: "0.25rem",
                            }}
                        >
                            {errors.cep}
                        </div>
                    )}
                </div>

                {/* Número e Complemento */}
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <InputNumber
                                id="number"
                                value={newAddress.number || null}
                                onChange={(e) => handleChangeNumber(e.value)}
                                onBlur={handleBlurNumber}
                                placeholder="Número"
                                useGrouping={false}
                                style={{
                                    ...numberStatus,
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "1rem",
                                }}
                            />
                            {getStatusIcon(fieldStatus.number, !!errors.number)}
                        </div>
                        {errors.number && fieldStatus.number === "touched" && (
                            <div
                                style={{
                                    color: "#dc3545",
                                    fontSize: "0.85rem",
                                    marginTop: "0.25rem",
                                }}
                            >
                                {errors.number}
                            </div>
                        )}
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <InputText
                                id="complement"
                                value={newAddress.complement || ""}
                                onChange={(e) =>
                                    handleChangeComplement(e.target.value)
                                }
                                placeholder="Apto, bloco..."
                                style={{
                                    ...complementStatus,
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "1rem",
                                }}
                            />
                            {getStatusIcon(fieldStatus.complement, false)}
                        </div>
                    </div>
                </div>

                {/* Rua */}
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
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <InputText
                            disabled
                            id="street"
                            value={newAddress.street || ""}
                            placeholder="Nome da rua (preenchido automaticamente)"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "4px",
                                borderColor: newAddress.street
                                    ? "#28a745"
                                    : "#ccc",
                                backgroundColor: newAddress.street
                                    ? "#f0fff4"
                                    : "#f8f9fa",
                                borderWidth: newAddress.street ? "2px" : "1px",
                            }}
                        />
                        {newAddress.street && (
                            <i
                                className="pi pi-check-circle"
                                style={{
                                    color: "#28a745",
                                    fontSize: "1.2rem",
                                }}
                            ></i>
                        )}
                    </div>
                </div>

                {/* Bairro */}
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
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <InputText
                            disabled
                            id="neighborhood"
                            value={newAddress.neighborhood || ""}
                            placeholder="Bairro (preenchido automaticamente)"
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "4px",
                                borderColor: newAddress.neighborhood
                                    ? "#28a745"
                                    : "#ccc",
                                backgroundColor: newAddress.neighborhood
                                    ? "#f0fff4"
                                    : "#f8f9fa",
                                borderWidth: newAddress.neighborhood
                                    ? "2px"
                                    : "1px",
                            }}
                        />
                        {newAddress.neighborhood && (
                            <i
                                className="pi pi-check-circle"
                                style={{
                                    color: "#28a745",
                                    fontSize: "1.2rem",
                                }}
                            ></i>
                        )}
                    </div>
                </div>

                {/* Cidade e Estado */}
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <InputText
                                disabled
                                id="city"
                                value={newAddress.city || ""}
                                placeholder="Cidade (preenchido automaticamente)"
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    borderColor: newAddress.city
                                        ? "#28a745"
                                        : "#ccc",
                                    backgroundColor: newAddress.city
                                        ? "#f0fff4"
                                        : "#f8f9fa",
                                    borderWidth: newAddress.city
                                        ? "2px"
                                        : "1px",
                                }}
                            />
                            {newAddress.city && (
                                <i
                                    className="pi pi-check-circle"
                                    style={{
                                        color: "#28a745",
                                        fontSize: "1.2rem",
                                    }}
                                ></i>
                            )}
                        </div>
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <InputText
                                disabled
                                id="state"
                                value={newAddress.state || ""}
                                placeholder="UF (preenchido automaticamente)"
                                maxLength={2}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "4px",
                                    borderColor: newAddress.state
                                        ? "#28a745"
                                        : "#ccc",
                                    backgroundColor: newAddress.state
                                        ? "#f0fff4"
                                        : "#f8f9fa",
                                    borderWidth: newAddress.state
                                        ? "2px"
                                        : "1px",
                                }}
                            />
                            {newAddress.state && (
                                <i
                                    className="pi pi-check-circle"
                                    style={{
                                        color: "#28a745",
                                        fontSize: "1.2rem",
                                    }}
                                ></i>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <Button
                        label="Cancelar"
                        onClick={handleDialogHide}
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
