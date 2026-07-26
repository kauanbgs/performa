import { Link } from "react-router-dom";

export const Navbar = () => {
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="w-full sticky top-0 z-30 backdrop-blur-xl bg-white/40 border-b border-white/60">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <Link
            to={token ? "/home" : "/"}
            className="text-3xl italic font-primary tracking-tight"
          >
            p.me
          </Link>
        </div>

        {/* 2. Centro (Menu de Links) */}
        <div
          className={
            token ? "flex justify-center gap-4 md:gap-8 text-sm font-medium font-secondary" : "hidden"
          }
        >
          {/* Aponta direto para /home: "/" redireciona quem está logado de
              volta para cá, o que fazia o link piscar a landing no caminho. */}
          <Link to="/home" className="hover:text-black transition-colors text-gray-900">
            Home
          </Link>
          <Link to="/ideias" className="hover:text-black transition-colors text-gray-900">
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
              className="hover:text-black cursor-pointer text-gray-900 transition-colors text-sm font-medium font-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
