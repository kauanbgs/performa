import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Text from "../../components/ui/Text";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });
    try {
      const response = await api.postLogin(user);
      setFeedback({
        message: response.data.message || "Login realizado com sucesso!",
        type: "success"
      });
      setTimeout(() => navigate("/home"), 1000); // Vai deixar o usuário ver a mensagem por 1seg
    } catch (error: any) {
      const msgErro =
        error.response.data.error || "Erro ao conectar com o servidor.";
      setFeedback({ message: msgErro, type: "error" });
    }
  };

  return (
    <div className="bg-[url('/FundoLogin.png')] bg-cover bg-center min-h-screen items-center flex align-center justify-center flex-col">
      <main className="w-[31%] bg-white rounded-lg items-center align-center justify-center min-h-125 w-[80%] max-w-105">
        <div className="flex flex-col items-center justify-center p-10">
          <img src="/LogoCarometro-v2.png" alt="" className="w-48" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-6">
          <div className="flex flex-col mb-3">
            <Text variant="text">Email</Text>
            <Input
              type="text"
              placeholder="Kauanbgs13@gmail.com"
              fill
              onChange={onChange}
              id="email"
              name="email"
              value={user.email}
            />
          </div>
          <div className="flex flex-col mb-6">
            <Text variant="text">Senha</Text>
            <Input
              type="password"
              placeholder="Senhaboa123!"
              fill
              onChange={onChange}
              id="password"
              name="password"
              value={user.password}
            />
          </div>
          <Button type="submit" text="Entrar" fill className="w-full" />
          <Text variant="text" className="mt-4">
            Esqueceu sua senha?{" "}
            <Link to="/" className="text-[var(--azulPrincipal)] cursor-pointer hover:underline">
              Recuperar senha
            </Link>
          </Text>
          <div className="min-h-[1.25rem] mt-2">
            {feedback.message && (
              <span className={`text-sm ${feedback.type === "error" ? "text-red-500" : "text-green-500"}`}>
                {feedback.message}
              </span>
            )}
          </div>
        </form>
        <div className="flex flex-col p-7 justify-center items-center gap-12">
          <Text variant="text" className="text-sm mt-8 ">
            Não tem uma conta?{" "}
            <Link to="/" className="text-[var(--azulPrincipal)] cursor-pointer hover:underline">
              Cadastre-se
            </Link>
          </Text>
        </div>
      </main>
    </div>
  );
}