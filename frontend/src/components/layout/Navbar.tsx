import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="w-full px-6 py-6 flex justify-between items-center relative z-20 max-w-7xl mx-auto">
        <div className="text-3xl font-bold italic brand-font tracking-tight">p.me</div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link to="/planos" className="hover:text-black transition-colors">Planos</Link>
            <Link to="/criar" className="hover:text-black transition-colors">Criar</Link>
            <Link to="/ideias" className="hover:text-black transition-colors">Ideias</Link>
        </div>

        <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium hover:text-gray-600 hidden sm:block">Login</Link>
            <Link to="/home" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105">
                Começar
            </Link>
        </div>
    </nav>
  );
};
