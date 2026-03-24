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
    console.log(user);
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
        error.response.data.error || "Erro ao conectar com o servidor.";
      setFeedback({ message: msgErro, type: "error" });
    }
  };

  return (
    <div className="bg-[url('/fundoLogin.png')] bg-cover bg-center min-h-screen items-center flex align-center justify-center flex-col">
      <main className="w-[31%] bg-white rounded-lg items-center align-center justify-center min-h-125 w-[80%] max-w-105">
        <div className="flex items-center justify-center p-10">
          <button onClick={() => navigate("/")}>
            <img src="/logoPerforma.png" alt="" className="w-48 cursor-pointer" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-6">
          <div className="flex flex-col mb-3">
            <Text variant="text" font="secondary">Nome</Text>
            <Input
              type="text"
              placeholder="Kauanbgs13"
              fill
              onChange={onChange}
              id="name"
              name="name"
              value={user.name}
            />
          </div>
          <div className="flex flex-col mb-3">
            <Text variant="text" font="secondary">Email</Text>
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
            <Text variant="text" font="secondary">Senha</Text>
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
          <Button type="submit" text="Entrar" fill className="w-full" font="secondary" />
          <Text variant="text" className="mt-4" font="secondary">
            Esqueceu sua senha?{" "}
            <Link to="/" className="cursor-pointer hover:underline">
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
          <Text variant="text" className="text-sm mt-8" font="secondary">
            Já tem uma conta?{" "}
            <Link to="/login" className="cursor-pointer hover:underline">
              Faça login
            </Link>
          </Text>
        </div>
      </main>
    </div>
  );
}