import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service";

import "@/styles/form.css";
import type {
    IAuthenticationResponse,
    IUserLogin,
} from "@/commons/types/types";
import { useToast } from "@/context/hooks/use-toast";

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
    const { showToast } = useToast();
    const { handleLogin } = useAuth();

    const onSubmit = useCallback(
        async (userLogin: IUserLogin) => {
            try {
                const response = await AuthService.login(userLogin);

                if (response.success && response.data) {
                    const authenticationResponse =
                        response.data as IAuthenticationResponse;
                    handleLogin(authenticationResponse);
                    
                    showToast(
                        "success",
                        "Sucesso",
                        "Login efetuado com sucesso."
                    );

                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, NAVIGATION_DELAY);
                } else {
                    showToast(
                        "error",
                        "Erro",
                        "Falha ao efetuar login. Verifique suas credenciais e tente novamente."
                    );
                }
            } catch (error) {
                console.error("Login error:", error);
                showToast(
                    "error",
                    "Erro",
                    "Falha ao efetuar login. Verifique suas credenciais e tente novamente."
                );
            }
        },
        [handleLogin, navigate, showToast]
    );

    return (
        <div className="flex align-items-center justify-content-center min-h-screen">
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
                                        className={classNames({
                                            "p-invalid": fieldState.error,
                                        })}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <small
                                            id="email-error"
                                            className="p-error block mt-1"
                                        >
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
                                        className={classNames({
                                            "p-invalid": fieldState.error,
                                        })}
                                        toggleMask
                                        feedback={false}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <small
                                            id="password-error"
                                            className="p-error block mt-1"
                                        >
                                            {fieldState.error.message}
                                        </small>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    <Button
                        severity="info" 
                        raised 
                        type="submit"
                        className="w-full text-1xl form-submit-button"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        aria-label="Entrar na conta"
                        label="Entrar na conta"
                    />

                    <div className="text-center flex flex-column lg:flex-row justify-content-center align-items-center gap-3">
                        <span className="text-lg">Não tem uma conta?</span>
                        <Link
                            to="/cadastro"
                            className="text-xl link"
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
