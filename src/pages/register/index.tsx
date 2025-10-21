import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";

import "@/styles/formulario.css";

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IUserRegister>({
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });
  
  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    try {
      const response = await signup(data);
      if (response.success === true && response.data) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao cadastrar usuário.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />

      <div className="h-auto bg-white lg:h-screen col-10 lg:col-7 p-4 shadow-2 border-round mx-auto ">
        <div className="text-center">
          <Link to="/">
            <img src="/assets/images/logo/logo_riffhouse_red.png" alt="Logo" className="w-12rem" />
          </Link>
          <div className="text-900 text-5xl font-medium mb-3 mt-5">Cadastre sua conta</div>
        </div>
      
        <form className="p-fluid flex flex-column gap-4 lg:gap-2" onSubmit={handleSubmit(onSubmit)} autoComplete="on">

          <div>
            <label htmlFor="displayName">Nome</label>
            <div className="field input-group p-inputgroup mt-1 mb-1">
                
                <Controller
                  name="displayName"
                  control={control}
                  rules={{ required: 'Nome é obrigatório' }}
                  render={({ field, fieldState }) => (
                    <InputText 
                      id={field.name} 
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.error }, "form-control")}
                    />
                  )}
                />
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
            </div>
            {errors.displayName && <small className="p-error">{errors.displayName.message}</small>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <div className="field input-group p-inputgroup mt-1 mb-1">
              
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.error }, "form-control")}
                    />
                  )}
                />
                <span className="p-inputgroup-addon">
                    <i className="pi pi-envelope"></i>
                </span>
            </div>
            {errors.email && <small className="p-error">{errors.email.message}</small>}
          </div>

          <div>
            <label htmlFor="password">Senha</label>
            <div className="field input-group p-inputgroup mt-1 mb-1">
              
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter no mínimo 6 caracteres'
                    },
                    validate: {
                      hasLower: value => /^(?=.*[a-z])/.test(value) || "A senha deve conter pelo menos uma letra minúscula",
                      hasUpper: value => /^(?=.*[A-Z])/.test(value) || "A senha deve conter pelo menos uma letra maiúscula",
                      hasNumber: value => /^(?=.*\d)/.test(value) || "A senha deve conter pelo menos um número",
                      hasSpecialChar: value => /^(?=.*[@$!%*?&])/.test(value) || "A senha deve conter pelo menos um caractere especial"
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.error }, "form-control")}
                      toggleMask
                      feedback={false}
                    />
                  )}
                />
                <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                </span>
            </div>
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="field input-group p-inputgroup mt-1 mb-1">
                
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: 'Confirme sua senha',
                    validate: value => value === password.current || 'As senhas não conferem'
                  }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.error }, "form-control")}
                      toggleMask
                      feedback={false}
                    />
                  )}
                />
                <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                </span>
            </div>
            {errors.confirmPassword &&
            <small className="p-error">{errors.confirmPassword.message}</small>}
          </div>

          <Button 
            label="Cadastrar" 
            type="submit"
            className="w-full btn-default text-2xl" 
            loading={loading}
          />

          <div className="text-center flex flex-column lg:flex-row justify-content-center align-items-center gap-3">
            <span className="text-lg">Já tem uma conta? </span>
            <Link to="/login" className="btn-outline text-xl">Faça login</Link>
          </div>
        </form>
      </div>

      <div className="hidden lg:flex col-5 align-items-center justify-content-center">
        <img 
          src="/assets/images/signup/fundo_signup.svg" 
          className="max-w-30rem" 
          alt="Imagem de Cadastro" 
          id="image-background-forms"
        />
      </div>
    </div>
  );
};