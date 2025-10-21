import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
// import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";
import { useAuth } from  "@/context/hooks/use-auth"; // adicionar a importação do hook useAuth

import '@/styles/formulario.css';
import { classNames } from "primereact/utils";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({ defaultValues: { email: "", password: "" } });  
  const navigate = useNavigate();
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin } =  useAuth(); // A função handleLogin será utilizada para atualizar o contexto com o usuário autenticado.
  const onSubmit = async (userLogin: IUserLogin) => {
    setLoading(true);
    try {
      const response = await login(userLogin);
      if (response.success === true && response.data) {
        const authenticationResponse = response.data as AuthenticationResponse; // Define o objeto com token após a autenticação
        handleLogin(authenticationResponse); // o contexto é atualizado com os dados da autenticação
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Login efetuado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao efetuar login.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao efetuar login.",
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
            <img src="/assets/images/logo/logo_riffhouse_red.png" alt="Logo" id="logo" className="w-12rem" />
          </Link>
          <div className="text-900 text-5xl font-medium mb-3 mt-5">Entre na Sua Conta</div>
        </div>
      
        <form className="p-fluid flex flex-column gap-4" onSubmit={handleSubmit(onSubmit)} autoComplete="on">

          <div className="field input-group">
            <label htmlFor="email">Email</label>
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
              
            {errors.email && <small className="p-error">{errors.email.message}</small>}
          </div>

          <div className="field input-group">
            <label htmlFor="password">Senha</label>
              <Controller
                name="password"
                control={control}
                rules={{ 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter no mínimo 6 caracteres'
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
              
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <Button 
            label="Entrar" 
            type="submit"
            className="w-full btn-default text-2xl" 
            loading={loading}
            id="login-btn"
            disabled={isSubmitting}
          />

          <div className="text-center flex flex-column lg:flex-row justify-content-center align-items-center gap-3">
            <span className="text-lg">Não tem uma conta? </span>
            <Link to="/register" className="btn-outline text-xl">Cadastre-se</Link>
          </div>
        </form>
      </div>

      <div className="hidden lg:flex col-5 align-items-center justify-content-center">
        <img 
          src="/assets/images/login/fundo_login.svg" 
          className="max-w-30rem" 
          alt="Imagem de Cadastro" 
          id="image-background-forms"
        />
      </div>
    </div> 
  );
};