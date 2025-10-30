import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import type { IUserLogin } from "@/commons/types/form";
import type { IAuthenticationResponse } from "@/commons/types/auth";
import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service";

import "@/styles/form.css";

// Constantes
const FORM_DEFAULT_VALUES: IUserLogin = {
  email: "",
  password: "",
};

const VALIDATION_RULES = {
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
  },
} as const;

const TOAST_MESSAGES = {
  success: {
    severity: "success" as const,
    summary: "Sucesso",
    detail: "Login efetuado com sucesso.",
    life: 3000,
  },
  error: {
    severity: "error" as const,
    summary: "Erro",
    detail: "Falha ao efetuar login. Verifique suas credenciais e tente novamente.",
    life: 3000,
  },
} as const;

const NAVIGATION_DELAY = 1000;

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IUserLogin>({ 
    defaultValues: FORM_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { handleLogin } = useAuth();

  const showToast = useCallback(
    (type: keyof typeof TOAST_MESSAGES) => {
      toast.current?.show(TOAST_MESSAGES[type]);
    },
    []
  );

  const onSubmit = useCallback(
    async (userLogin: IUserLogin) => {
      try {
        const response = await AuthService.login(userLogin);

        if (response.success && response.data) {
          const authenticationResponse = response.data as IAuthenticationResponse;
          handleLogin(authenticationResponse);
          showToast("success");

          setTimeout(() => {
            navigate("/", { replace: true });
          }, NAVIGATION_DELAY);
        } else {
          showToast("error");
        }
      } catch (error) {
        console.error("Login error:", error);
        showToast("error");
      }
    },
    [handleLogin, navigate, showToast]
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
          <h1 className="text-900 text-5xl font-medium mb-3 mt-5">
            Entre na Sua Conta
          </h1>
        </header>

        <form
          className="p-fluid flex flex-column gap-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
          noValidate
        >
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
                  <Password
                    inputId="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    aria-describedby="password-error"
                    aria-invalid={!!fieldState.error}
                    className={classNames({ "p-invalid": fieldState.error })}
                    toggleMask
                    feedback={false}
                    {...field}
                  />
                  {fieldState.error && (
                    <small id="password-error" className="p-error block mt-1">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <Button
            label="Entrar"
            type="submit"
            className="w-full btn-default text-2xl"
            loading={isSubmitting}
            disabled={isSubmitting}
            aria-label="Entrar na conta"
          />

          <div className="text-center flex flex-column lg:flex-row justify-content-center align-items-center gap-3">
            <span className="text-lg">Não tem uma conta?</span>
            <Link
              to="/register"
              className="btn-outline text-xl"
              aria-label="Ir para página de cadastro"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>

      <aside
        className="hidden lg:flex col-5 align-items-center justify-content-center"
        aria-hidden="true"
      >
        <img
          src="/assets/images/login/fundo_login.svg"
          className="image-background-forms"
          alt="mulher sentada dando boas vindas"
          role="presentation"
        />
      </aside>
    </div>
  );
};
