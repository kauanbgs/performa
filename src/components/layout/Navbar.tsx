import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import Button from "../ui/Button";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white h-16 flex items-center px-6 justify-between">
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-xl text-blue-600"
      >
        <ImageIcon className="w-6 h-6" />
        <span>Performa Editor</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/home">
          <Button>Meus Projetos</Button>
        </Link>
        <Link to="/editor">
          <Button>Novo Projeto</Button>
        </Link>
      </div>
    </nav>
  );
};
