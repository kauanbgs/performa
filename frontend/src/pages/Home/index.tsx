import { Navbar } from "../../components/layout/Navbar";
import { Music, Clapperboard, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/axios";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  if (!token) {
    navigate("/");
  }

  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.getProfile(token);
        const userId = profile.data.id;

        const response = await api.getProjects(token, userId);
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const createProject = (title: string) => {
    const defaultTitle = title || "Novo Projeto";
    api.postProject(token, { title: defaultTitle }).then((response: any) => {
      navigate(`/editor/${response.data.id}`);
    }).catch((err: any) => console.error("Erro ao criar projeto:", err));
  };
  return (
    <div className="min-h-screen bg-[#fdfbf9] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 items-start">
          {/* Lado Esquerdo: Header e Cards */}
          <div className="lg:col-span-8 flex flex-col">
            <header className="mb-16">
              <h1 className="text-6xl md:text-7xl font-primary text-gray-900 mb-4">
                Olá, {localStorage.getItem("name")}.
              </h1>
              <p className="text-gray-400 font-secondary text-lg">
                O que vamos criar hoje?
              </p>
            </header>

            {/* Action Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="group cursor-pointer block p-6 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all hover:shadow-sm" onClick={() => createProject("Post Musical")}>
                <Music className="w-8 h-8 text-gray-700 mb-4 stroke-[1.5]" />
                <h3 className="text-2xl font-primary text-gray-900 mb-2 font-medium">
                  Post Musical
                </h3>
                <p className="text-gray-500 font-secondary text-sm leading-relaxed max-w-xs">
                  Destaque letras, albuns ou músicas da forma em que você desejar.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group cursor-pointer block p-6 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all hover:shadow-sm" onClick={() => createProject("Post Cinéfilo")}>
                <Film className="w-8 h-8 text-gray-700 mb-4 stroke-[1.5]" />
                <h3 className="text-2xl font-primary text-gray-900 mb-2 font-medium">
                  Post cinéfilo
                </h3>
                <p className="text-gray-500 font-secondary text-sm leading-relaxed max-w-xs">
                  Poster Art, estrelas e críticas com o filme selecionado.
                </p>
              </div>
            </section>
          </div>

          {/* Lado Direito: Banner do Último Projeto */}
          {/* <div className="lg:col-span-4 flex flex-col justify-start w-full">
            <section className="w-full flex flex-col">
              <h2 className="text-xl font-primary text-gray-400 mb-4">
                Preview do último projeto
              </h2>
              <div className="group cursor-pointer block p-6 border border-gray-100 rounded-2xl hover:border-gray-300 transition-all hover:shadow-sm" onClick={() => navigate(`/editor/${(lastProject as any).id}`)}>
                <img src={(lastProject as any).previewImage || "/transparente.jpg"} alt="Último projeto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </section>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Recent Projects (Left - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-primary text-gray-900">
                Projetos Recentes
              </h2>
              {/* <button className="text-xs font-medium text-gray-400 hover:text-gray-900 tracking-wider transition-colors uppercase">
                Ver todos
              </button> */}
            </div>

            <div className="space-y-8">
              {/* Project Items */}
              {projects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center group cursor-pointer"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 mr-5 group-hover:bg-gray-100 transition-colors border border-gray-100">
                    <Clapperboard className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-primary text-xl text-gray-900 mb-1">
                      {project.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                      {project.type} - {new Date(project.updatedAt).toLocaleDateString('pt-BR')} às {new Date(project.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
