import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";

import "@/styles/form.css";

// Constantes
const FORM_DEFAULT_VALUES: IUserRegister = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const VALIDATION_RULES = {
  displayName: {
    required: "Nome é obrigatório",
    minLength: {
      value: 3,
      message: "O nome deve ter no mínimo 3 caracteres",
    },
  },
  email: {
    required: "Email é obrigatório",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email inválido",
    },
  },
  password: {
    required: "Senha é obrigatória",
    minLength: {
      value: 6,
      message: "A senha deve ter no mínimo 6 caracteres",
    },
    validate: {
      hasLower: (value: string) =>
        /^(?=.*[a-z])/.test(value) ||
        "A senha deve conter pelo menos uma letra minúscula",
      hasUpper: (value: string) =>
        /^(?=.*[A-Z])/.test(value) ||
        "A senha deve conter pelo menos uma letra maiúscula",
      hasNumber: (value: string) =>
        /^(?=.*\d)/.test(value) || "A senha deve conter pelo menos um número",
      hasSpecialChar: (value: string) =>
        /^(?=.*[@$!%*?&])/.test(value) ||
        "A senha deve conter pelo menos um caractere especial",
    },
  },
} as const;

const TOAST_MESSAGES = {
  success: {
    severity: "success" as const,
    summary: "Sucesso",
    detail: "Usuário cadastrado com sucesso.",
    life: 3000,
  },
  error: {
    severity: "error" as const,
    summary: "Erro",
    detail: "Falha ao cadastrar usuário. Verifique os dados e tente novamente.",
    life: 3000,
  },
} as const;

const NAVIGATION_DELAY = 1000;

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<IUserRegister>({
    defaultValues: FORM_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const passwordValue = watch("password");

  const showToast = useCallback(
    (type: keyof typeof TOAST_MESSAGES) => {
      toast.current?.show(TOAST_MESSAGES[type]);
    },
    []
  );

  const onSubmit = useCallback(
    async (data: IUserRegister) => {
      try {
        const response = await AuthService.signup(data);

        if (response.success && response.data) {
          showToast("success");

          setTimeout(() => {
            navigate("/login", { replace: true });
          }, NAVIGATION_DELAY);
        } else {
          showToast("error");
        }
      } catch (error) {
        console.error("Register error:", error);
        showToast("error");
      }
    },
    [navigate, showToast]
  );

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <Toast ref={toast} />

      <div className="lg:min-h-screen bg-white col-10 lg:col-7 p-4 shadow-2 border-round flex flex-column xl:justify-content-center">
        <header className="text-center">
          <Link to="/" aria-label="Ir para página inicial">
            <img
              src="/assets/images/logo/logo_riffhouse_red.png"
              alt="Logo Riff House"
              className="w-12rem"
            />
          </Link>
          <h1 className="text-900 text-5xl font-medium mb-3 mt-0">
            Cadastre sua conta
          </h1>
        </header>

        <form
          className="p-fluid flex flex-column gap-5 lg:gap-3"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
          noValidate
        >
          <div>
            <label htmlFor="displayName" className="block mb-2">
              Nome
            </label>
            <Controller
              name="displayName"
              control={control}
              rules={VALIDATION_RULES.displayName}
              render={({ field, fieldState }) => (
                <>
                  <div className="p-inputgroup">
                    <InputText
                      id="displayName"
                      type="text"
                      autoComplete="name"
                      placeholder="Digite seu nome completo"
                      aria-describedby="displayName-error"
                      aria-invalid={!!fieldState.error}
                      className={classNames({ "p-invalid": fieldState.error })}
                      {...field}
                    />
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user" aria-hidden="true"></i>
                    </span>
                  </div>
                  {fieldState.error && (
                    <small id="displayName-error" className="p-error block mt-1">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={VALIDATION_RULES.email}
              render={({ field, fieldState }) => (
                <>
                  <div className="p-inputgroup">
                    <InputText
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      aria-describedby="email-error"
                      aria-invalid={!!fieldState.error}
                      className={classNames({ "p-invalid": fieldState.error })}
                      {...field}
                    />
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-envelope" aria-hidden="true"></i>
                    </span>
                  </div>
                  {fieldState.error && (
                    <small id="email-error" className="p-error block mt-1">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">
              Senha
            </label>
            <Controller
              name="password"
              control={control}
              rules={VALIDATION_RULES.password}
              render={({ field, fieldState }) => (
                <>
                  <div className="p-inputgroup w-full">
                    <Password
                      id="password"
                      autoComplete="new-password"
                      placeholder="Digite uma senha forte"
                      aria-describedby="password-error"
                      aria-invalid={!!fieldState.error}
                      className={classNames({ "p-invalid": fieldState.error }, "w-full")}
                      inputClassName="w-full"
                      toggleMask
                      feedback={false}
                      {...field}
                    />
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock" aria-hidden="true"></i>
                    </span>
                  </div>
                  {fieldState.error && (
                    <small id="password-error" className="p-error block mt-1">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2">
              Confirmar Senha
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirme sua senha",
                validate: (value) =>
                  value === passwordValue || "As senhas não conferem",
              }}
              render={({ field, fieldState }) => (
                <>
                  <div className="p-inputgroup w-full">
                    <Password
                      id="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Digite a senha novamente"
                      aria-describedby="confirmPassword-error"
                      aria-invalid={!!fieldState.error}
                      className={classNames({ "p-invalid": fieldState.error }, "w-full")}
                      inputClassName="w-full"
                      toggleMask
                      feedback={false}
                      {...field}
                    />
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock" aria-hidden="true"></i>
                    </span>
                  </div>
                  {fieldState.error && (
                    <small id="confirmPassword-error" className="p-error block mt-1">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <Button
            label="Cadastrar"
            type="submit"
            className="w-full btn-default text-2xl"
            loading={isSubmitting}
            disabled={isSubmitting}
            aria-label="Cadastrar nova conta"
          />

          <div className="text-center flex flex-column lg:flex-row justify-content-center align-items-center gap-3">
            <span className="text-lg">Já tem uma conta?</span>
            <Link
              to="/login"
              className="btn-outline text-xl"
              aria-label="Ir para página de login"
            >
              Faça login
            </Link>
          </div>
        </form>
      </div>

      <aside
        className="hidden lg:flex col-5 align-items-center justify-content-center"
        aria-hidden="true"
      >
        <img
          src="/assets/images/signup/fundo_signup.svg"
          className="image-background-forms"
          alt="mulher clicando em botão play"
          role="presentation"
        />
      </aside>
    </div>
  );
};
