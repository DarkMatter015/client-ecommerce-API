import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { IAuthenticatedUser, IAuthenticationResponse } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import AuthService from "@/services/auth-service";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: IAuthenticatedUser;
  handleLogin: (authenticationResponse: IAuthenticationResponse) => Promise<any>;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] =
    useState<IAuthenticatedUser | undefined>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    delete api.defaults.headers.common["Authorization"];

    setAuthenticated(false);
    setAuthenticatedUser(undefined);

    // Navegar aqui é OK porque é uma ação explícita de logout
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const validateUserSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token"); // token should be plain string

        if (!storedToken) {
          // nenhum token => ficar não autenticado (mas sem navegar)
          setAuthenticated(false);
          setAuthenticatedUser(undefined);
          setLoading(false);
          return;
        }

        const response = await AuthService.validateToken(storedToken);

        if (response.success && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setAuthenticatedUser(parsedUser);
        setAuthenticated(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        } else {
        // token inválido -> manter dados no localStorage para possível reautenticação, apenas desautenticar
        console.warn("Token inválido ou expirado, mantendo dados para reautenticação");
        setAuthenticated(false);
        setAuthenticatedUser(undefined);
        // Não remover do localStorage para permitir re-login automático ou manual
        }
      } catch (err) {
        // falha de rede ou erro inesperado: deixar não autenticado, mas não navegar
        console.error("Erro validando sessão:", err);
        setAuthenticated(false);
        setAuthenticatedUser(undefined);
      } finally {
        setLoading(false);
      }
    };

  validateUserSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (
    authenticationResponse: IAuthenticationResponse
  ) => {
    try {
      const { token, user } = authenticationResponse;
      localStorage.setItem("token", token);
      
      localStorage.setItem("user", JSON.stringify(user));
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthenticatedUser(user);
      setAuthenticated(true);
    } catch (err){
      console.log("Erro no login: ", err);
      handleLogout();
    }
  };

  if (loading) {
    return <div>Validando sessão ...</div>;
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };