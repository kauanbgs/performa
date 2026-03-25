import { Link } from "react-router-dom";

export const Navbar = () => {
  const token = localStorage.getItem("token");
  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="w-full px-6 py-6 flex items-center justify-between relative z-20 max-w-7xl mx-auto">
      {/* 1. Lado Esquerdo (Logo) - flex-1 empurra o resto */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="text-3xl font-bold italic font-primary tracking-tight">
          p.me
        </Link>
      </div>

      {/* 2. Centro (Menu de Links) */}
      <div
        className={
          token
            ? "hidden md:flex justify-center gap-4 md:gap-8 text-sm font-medium text-gray-600 font-secondary"
            : "flex justify-center gap-4 md:gap-8 text-sm font-medium text-gray-600 font-secondary"
        }
      >
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <Link to="/planos" className="hover:text-black transition-colors">
          Planos
        </Link>
        <Link to="/" className="hover:text-black transition-colors">
          Criar
        </Link>
        <Link to="/ideias" className="hover:text-black transition-colors">
          Ideias
        </Link>
      </div>

      {/* 3. Lado Direito (Ações) - flex-1 empurra para a direita */}
      <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
        {/* Botões - Usuário Deslogado */}
        <div className={token ? "hidden" : "flex items-center gap-4 md:gap-6"}>
          <Link
            to="/login"
            className="text-sm font-medium hover:text-gray-600 hidden sm:block font-secondary"
          >
            Login
          </Link>
          <Link
            to="/cadastro"
            className="bg-black text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 whitespace-nowrap font-secondary"
          >
            Começar
          </Link>
        </div>

        {/* Botões - Usuário Logado */}
        <div className={token ? "flex items-center gap-6" : "hidden"}>
          <button
            onClick={handleLogout}
            className="hover:text-black transition-colors text-sm font-medium text-gray-600 font-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
