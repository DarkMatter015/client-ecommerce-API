import { AuthContext } from "@/context/AuthContext";
import type React from "react";
import { use, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import AuthService from "@/services/auth-service";
import "./profile.style.css";
import { Link } from "react-router-dom";
import type { IUser } from "@/commons/types/types";

const Profile: React.FC = () => {
  const { authenticatedUser, setAuthenticatedUser } = use(AuthContext);
  const toast = useRef<Toast>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(
    authenticatedUser?.displayName || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditDisplayName(authenticatedUser?.displayName || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditDisplayName(authenticatedUser?.displayName || "");
  };

  const handleSave = async () => {
    if (!editDisplayName.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Campo Obrigatório",
        detail: "O nome de usuário não pode estar vazio.",
        life: 3000,
      });
      return;
    }

    if (editDisplayName === authenticatedUser?.displayName) {
      setIsEditing(false);
      return;
    }

    const updatedUser: IUser = {
      id: authenticatedUser?.id,
      displayName: editDisplayName,
    };


    try {
      setIsSaving(true);
      const response = await AuthService.updateProfile(updatedUser);

      if (response.status == 200) {
        setAuthenticatedUser({
          ...authenticatedUser!,
          displayName: editDisplayName,
        });
        setIsEditing(false);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Perfil atualizado com sucesso!",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: response.message || "Erro ao atualizar o perfil",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao atualizar o perfil. Tente novamente.",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <Toast ref={toast} />

      <div className="profile-container">
        <h1>Meu Perfil</h1>

        <Card className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="pi pi-user"></i>
            </div>
            <div className="profile-info">
              <h2>Informações da Conta</h2>
            </div>
          </div>

          <div className="profile-content">
            {/* Display Name Field */}
            <div className="profile-field">
              <label htmlFor="displayName" className="field-label">
                Nome de Usuário
              </label>
              <div className="field-wrapper">
                {isEditing ? (
                  <InputText
                    id="displayName"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="field-input edit-mode"
                    autoFocus
                  />
                ) : (
                  <div className="field-display">
                    <span className="field-value">{authenticatedUser?.displayName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div className="profile-field">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <div className="field-wrapper">
                <div className="field-display">
                  <span className="field-value">{authenticatedUser?.email}</span>
                  <span className="field-badge">Verificado</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <Button
                    label="Cancelar"
                    onClick={handleCancel}
                    className="p-button-secondary"
                    outlined
                  />
                  <Button
                    label="Salvar Alterações"
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                    icon="pi pi-check"
                  />
                </div>
              ) : (
                <Button
                  label="Editar Perfil"
                  onClick={handleEditClick}
                  icon="pi pi-pencil"
                  className="p-button-primary"
                />
              )}
            </div>
          </div>
        </Card>

        {/* Additional Info Card */}
        <Card className="profile-card info-card">
          

          <div className="info-section">
            <div className="info-item">
              <i className="pi pi-map-marker"></i>
              <div>
                <h4>Endereços</h4>
                <p>Visualize e gerencie seus endereços salvos</p>
              </div>
            </div>
            <Button
              icon="pi pi-arrow-right"
              className="p-button-text"
              disabled
              title="Em desenvolvimento"
            />
          </div>

          <div className="info-section">
            <div className="info-item">
              <i className="pi pi-shopping-bag"></i>
              <div>
                <h4>Meus Pedidos</h4>
                <p>Acompanhe o status de seus pedidos</p>
              </div>
            </div>
            <Link to={"/pedidos"}>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-text"
                title="Meus Pedidos"
              />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
