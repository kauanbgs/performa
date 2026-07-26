import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Text from "../../components/ui/Text";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/axios";

export default function Cadastro() {
  const [user, setUser] = useState({
    name: "",
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
      const response = await api.postCadastro(user);
      setFeedback({
        message: response.data.message || "Cadastro realizado com sucesso!",
        type: "success"
      });
      setTimeout(() => navigate("/login"), 1000); // Vai deixar o usuário ver a mensagem por 1seg
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
          <label htmlFor="name" className="mb-4 flex flex-col gap-1.5">
            <Text variant="text" font="secondary">Nome</Text>
            <Input
              type="text"
              placeholder="Como você quer ser chamado"
              autoComplete="name"
              required
              fill
              onChange={onChange}
              id="name"
              name="name"
              value={user.name}
            />
          </label>
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
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
              fill
              onChange={onChange}
              id="password"
              name="password"
              value={user.password}
            />
          </label>

          <Button type="submit" className="w-full">Criar conta</Button>

          <div className="min-h-[1.25rem] mt-2" aria-live="polite">
            {feedback.message && (
              <span className={`text-sm font-secondary ${feedback.type === "error" ? "text-red-600" : "text-green-600"}`}>
                {feedback.message}
              </span>
            )}
          </div>
        </form>

        <Text variant="text" className="mt-8 text-center" font="secondary">
          Já tem uma conta?{" "}
          <Link to="/login" className="cursor-pointer underline underline-offset-4">
            Faça login
          </Link>
        </Text>
      </main>
    </div>
  );
}