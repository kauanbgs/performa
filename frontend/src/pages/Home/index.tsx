import { Navbar } from "../../components/layout/Navbar";
import { Music, Clapperboard, Film, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/axios";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const [projects, setProjects] = useState<any[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profile = await api.getProfile(token);
        const userId = profile.data.id;

        const response = await api.getProjects(token, userId);
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const createProject = (title: string) => {
    if (projects.length >= 3) {
      alert("Você atingiu o limite de 3 projetos.");
      return;
    }
    const defaultTitle = title || "Novo Projeto";
    api.postProject(token, { title: defaultTitle }).then((response: any) => {
      navigate(`/editor/${response.data.id}`);
    }).catch((err: any) => {
      const msg = err?.response?.data?.error;
      if (err?.response?.status === 403) {
        alert(msg || "Limite de projetos atingido.");
      } else {
        console.error("Erro ao criar projeto:", err);
      }
    });
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await api.deleteProject(token, id);
      setProjects((prev: any[]) => prev.filter((p: any) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9] font-sans">
      <Navbar />

      {/* Modal de Confirmação */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-primary text-gray-900 mb-2">Deletar projeto?</h3>
            <p className="text-gray-500 font-secondary text-sm mb-6 leading-relaxed">
              Essa ação é irreversível. O projeto será permanentemente deletado.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Recent Projects (Left - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-primary text-gray-900">
                Projetos Recentes
              </h2>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                projects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center group rounded-xl hover:bg-gray-50 transition-colors px-2 py-3"
                >
                  <div
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => navigate(`/editor/${project.id}`)}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 mr-5 group-hover:bg-white transition-colors border border-gray-100 shrink-0">
                      <Clapperboard className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-primary text-xl text-gray-900 mb-1 truncate">
                        {project.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        {project.type} - {new Date(project.updatedAt).toLocaleDateString('pt-BR')} às {new Date(project.updatedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>

                  {/* Botão de deletar */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(project.id); }}
                    className="ml-4 p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Deletar projeto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                )
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

