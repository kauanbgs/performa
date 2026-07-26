import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lê o token e redireciona pro login se ele não existir — evita repetir
// esse par (leitura + useEffect de redirect) em toda página autenticada.
export function useRequireAuth(redirectTo = "/login") {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") ?? "";

  useEffect(() => {
    if (!token) {
      navigate(redirectTo);
    }
  }, [token, navigate, redirectTo]);

  return token;
}
