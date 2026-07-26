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
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.user.name);
      setTimeout(() => navigate("/home"), 1000); // Vai deixar o usuário ver a mensagem por 1seg
    } catch (error: any) {
      const msgErro =
        error.response?.data?.error || "Erro ao conectar com o servidor.";
      setFeedback({ message: msgErro, type: "error" });
    }
  };

  return (
    <div className="bg-[url('/fundoLogin.png')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-[26rem] rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-8 sm:p-10">
        <button
          onClick={() => navigate("/")}
          className="mx-auto mb-8 block"
          aria-label="Voltar para a página inicial"
        >
          <img src="/logoPerforma.png" alt="Performa" className="w-40 cursor-pointer" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="email" className="mb-4 flex flex-col gap-1.5">
            <Text variant="text" font="secondary">Email</Text>
            <Input
              type="email"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              required
              fill
              onChange={onChange}
              id="email"
              name="email"
              value={user.email}
            />
          </label>
          <label htmlFor="password" className="mb-6 flex flex-col gap-1.5">
            <Text variant="text" font="secondary">Senha</Text>
            <Input
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              required
              fill
              onChange={onChange}
              id="password"
              name="password"
              value={user.password}
            />
          </label>

          <Button type="submit" className="w-full">Entrar</Button>

          <Text variant="text" className="mt-4" font="secondary">
            Esqueceu sua senha?{" "}
            <Link to="/" className="cursor-pointer hover:underline">
              Recuperar senha
            </Link>
          </Text>

          <div className="min-h-[1.25rem] mt-2 font-secondary" aria-live="polite">
            {feedback.message && (
              <span className={`text-sm ${feedback.type === "error" ? "text-red-600" : "text-green-600"}`}>
                {feedback.message}
              </span>
            )}
          </div>
        </form>

        <Text variant="text" className="mt-8 text-center" font="secondary">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="cursor-pointer underline underline-offset-4">
            Cadastre-se
          </Link>
        </Text>
      </main>
    </div>
  );
}