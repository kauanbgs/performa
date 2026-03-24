import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Palette,
  Home,
  Film,
  Disc,
  Undo,
  Redo,
  Download,
  Save,
  Loader2,
  Maximize,
  ZoomIn,
  ZoomOut,
  Instagram,
  MessageCircle,
} from "lucide-react";
import "../../index.css";
import { useState, useRef, useEffect } from "react";
import SpotifyCanvas from "../../components/canvas/spotifyCanvas";
import LetterboxdCanvas from "../../components/canvas/letterboxdCanvas";
import api from "../../services/axios";
import WhatsappCanvas from "../../components/canvas/whatsappCanvas";
import InstagramCanvas from "../../components/canvas/instagramCanvas";

export default function Editor() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token") as string;
  if (!token) {
    navigate("/");
  }

  const { id } = useParams() as { id: string };

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await api.updateProject(token, id, content);
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const [activeTool, setActiveTool] = useState<string | null>(
    window.innerWidth < 768 ? null : "design",
  );
  const [zoom, setZoom] = useState(1);
  const [activeMode, setActiveMode] = useState("spotify");
  const [loading, setLoading] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [content, setContent] = useState<any>({
    title: "",
    itemTitle: "",
    artist: "",
    lyrics: "",
    coverImages: [],
    bgImages: [],
    posterImages: [],
    profileImages: [],
    coverImage: "",
    bgImage: "",
    glassmorphism: true,
    glassColor: "#ffffff",
    posterImage: "",
    profileImage: "",
    rating: 5,
    contentColor: "#808080",
    bgColor: "#e5ddd5",
    previewImage: "/transparente.jpg",
    messages: [
      { text: "Oi! Tudo bem?", type: "received", time: "10:42" },
      { text: "Tudo sim! E você?", type: "sent", time: "10:43" },
      { text: "O que você vai fazer hoje?", type: "received", time: "10:44" },
      {
        text: "Ainda não sei, talvez saia mais tarde 😄",
        type: "sent",
        time: "10:45",
      },
    ],
    followers: 100,
    posts: 5,
  });

  const handleInputZoomPlus = () => {
    setZoom((prevZoom: any) => prevZoom + 0.1);
  };
  const handleInputZoomMinus = () => {
    setZoom((prevZoom: any) => prevZoom - 0.1);
  };
  const handleInputZoomNormal = () => {
    setZoom(1);
  };
  useEffect(() => {
    api
      .getProject(token, id)
      .then((response: any) => {
        const projectData = response.data;
        if (projectData && projectData.content) {
          setContent({
            title: projectData.title,
            ...projectData.content,
            previewImage:
              projectData.content.previewImage || "/transparente.jpg",
          });
        }
      })
      .catch((err: any) => console.error("Erro ao carregar projeto:", err));
  }, [id]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // arquivo real
    formData.append("upload_preset", "performa"); // seu preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhur4ejzm/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Erro Cloudinary:", data);
      throw new Error(data.error?.message || "Erro no upload Cloudinary");
    }

    return data.secure_url; // URL final da imagem
  };

  const handleBlur = (field: keyof typeof content, value: string) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof typeof content, value: string) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "bg" | "poster" | "profile",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview imediato
    const preview = URL.createObjectURL(file);

    // Atualiza estado para mostrar preview
    setContent((prev: any) => {
      const imagesKey = type + "Images"; // ex: "coverImages"
      const imageKey = type + "Image"; // ex: "coverImage"
      return {
        ...prev,
        [imagesKey]: [...(prev[imagesKey] || []), preview],
        [imageKey]: preview,
      };
    });

    try {
      // Upload Cloudinary
      const url = await uploadImage(file);

      setContent((prev: any) => {
        const imagesKey = type + "Images";
        const imageKey = type + "Image";
        const newImages = [...(prev[imagesKey] || [])];
        // substitui o preview pelo URL real
        newImages[newImages.length - 1] = url;

        return {
          ...prev,
          [imagesKey]: newImages,
          [imageKey]: url,
        };
      });
    } catch (err) {
      console.error("Erro no upload:", err);
    }
  };

  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      // Salva antes de exportar
      await api.updateProject(token, id, content);

      const response = await fetch(
        "https://performa-i6sk.onrender.com/performa/export",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...content, template: activeMode }),
        },
      );

      if (!response.ok) {
        console.error("Erro na exportação:", await response.text());
        return;
      }

      const blob = await response.blob();

      // Criar um arquivo a partir do blob para upload
      const file = new File([blob], "preview.png", { type: "image/png" });
      const previewUrl = await uploadImage(file);

      // Atualizar o estado e persistir no banco de dados
      setContent((prev: any) => {
        const updated = { ...prev, previewImage: previewUrl };
        api.updateProject(token, id, updated); // Salva no banco
        return updated;
      });

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${activeMode}-${content.title}.png`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDownload(false);
    }
  };
  return (
    <div className="flex flex-col-reverse md:flex-row h-dvh bg-gray-100 font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <aside className="w-full h-16 md:w-[72px] md:h-full bg-[#1a1a1a] flex flex-row md:flex-col items-center py-0 md:py-6 px-2 md:px-0 text-gray-400 z-30 shrink-0 justify-around md:justify-start">
        <Link
          to="/home"
          className="hidden md:flex mb-8 font-secondary italic text-white text-xl font-bold items-center justify-center"
        >
          p.me
        </Link>

        <nav className="flex flex-row md:flex-col w-full md:w-auto justify-around md:justify-start md:gap-2 h-full items-center">
          <button
            onClick={() => setActiveTool("design")}
            className={`flex flex-col items-center gap-1.5 p-3 transition-colors ${
              activeTool === "design"
                ? "text-white bg-white/10 relative"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTool === "design" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            )}
            <LayoutTemplate className="w-5 h-5" />
            <span className="text-[10px] font-medium">Design</span>
          </button>

          <button
            onClick={() => setActiveTool("text")}
            className={`flex flex-col items-center gap-1.5 p-3 transition-colors ${
              activeTool === "text"
                ? "text-white bg-white/10 relative"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTool === "text" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            )}
            <Type className="w-5 h-5" />
            <span className="text-[10px] font-medium">Texto</span>
          </button>

          <button
            onClick={() => setActiveTool("uploads")}
            className={`flex flex-col items-center gap-1.5 p-3 transition-colors ${
              activeTool === "uploads"
                ? "text-white bg-white/10 relative"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTool === "uploads" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            )}
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Uploads</span>
          </button>

          <button
            onClick={() => setActiveTool("style")}
            className={`flex flex-col items-center gap-1.5 p-3 transition-colors ${
              activeTool === "style"
                ? "text-white bg-white/10 relative"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            {activeTool === "style" && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            )}
            <Palette className="w-5 h-5" />
            <span className="text-[10px] font-medium">Estilo</span>
          </button>

          <Link
            to="/home"
            className="flex md:hidden flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
        </nav>

        <div className="hidden md:flex mt-auto">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* 2. Toolbox Panel */}
      <div
        className={`
        fixed md:relative bottom-16 md:bottom-0 left-0 
        w-full md:w-80 h-[55vh] md:h-full 
        bg-white border-t md:border-t-0 md:border-r border-gray-200 flex flex-col z-20 transition-transform duration-300
        ${activeTool ? "translate-y-0" : "translate-y-full md:translate-y-0"}
      `}
      >
        <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
            {activeTool === "design" && "Templates"}
            {activeTool === "text" && "Editor de Texto"}
            {activeTool === "uploads" && "Uploads"}
            {activeTool === "style" && "Estilo"}
            {activeTool === "elements" && "Elementos"}
          </h2>
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gray-800"
            onClick={() => setActiveTool(null)}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTool === "design" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Template Item 1 */}
              <button
                onClick={() => {
                  setActiveMode("spotify");
                  content.itemTitle = "Nome da música";
                  content.artist = "Nome do artista";
                  content.lyrics = "Sua letra";
                  content.bgColor = "#a265cb";
                  content.coverImage = "/beatles.jpg";
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "spotify" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <Disc className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Spotify
                </span>
              </button>
              {/* Template Item 2 */}
              <button
                onClick={() => {
                  setActiveMode("letterboxd");
                  content.itemTitle = "Nome do filme";
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "letterboxd" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Letterboxd
                </span>
              </button>
              {/* Template Item 3 */}
              <button
                onClick={() => {
                  setActiveMode("whatsapp");
                  content.itemTitle = "Kauan Plaza";
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "whatsapp" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Whatsapp
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveMode("instagram");
                  content.bgColor = "#FFFFFF";
                  content.bgImage = "";
                  content.itemTitle = "Kauan Plaza";
                  content.followers = "344";
                  content.posts = "0";
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "instagram" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <Instagram className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Instagram
                </span>
              </button>
            </div>
          )}
          {activeTool === "text" && activeMode === "spotify" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Música
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) =>
                    handleInputChange("itemTitle", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Nome da música"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Artista
                </label>
                <input
                  type="text"
                  value={content.artist}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Nome do artista"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Letra
                </label>
                <textarea
                  value={content.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all min-h-[150px] resize-y"
                  placeholder="Digite a letra da música..."
                />
              </div>
            </div>
          )}

          {activeTool === "text" && activeMode === "letterboxd" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nome do filme
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) =>
                    handleInputChange("itemTitle", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Nome do filme"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Avaliação
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={content.rating}
                  onChange={(e) => handleInputChange("rating", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Estrelas"
                />
              </div>
            </div>
          )}
          {activeTool === "text" && activeMode === "instagram" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) =>
                    handleInputChange("itemTitle", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Ex: Maria"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Seguidores
                </label>
                <input
                  type="number"
                  min={0}
                  value={content.followers}
                  onChange={(e) =>
                    handleInputChange("followers", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Seguidores"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Posts
                </label>
                <input
                  type="number"
                  min={0}
                  value={content.posts}
                  onChange={(e) => handleInputChange("posts", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Posts"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mensagens
                </label>
                {(content.messages || []).map((msg: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          msg.type === "sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {msg.type === "sent" ? "Enviada" : "Recebida"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const updated = content.messages.map(
                              (m: any, i: number) =>
                                i === index
                                  ? {
                                      ...m,
                                      type:
                                        m.type === "sent" ? "received" : "sent",
                                    }
                                  : m,
                            );
                            setContent((prev: any) => ({
                              ...prev,
                              messages: updated,
                            }));
                          }}
                          className="text-[10px] text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 hover:border-gray-400 transition-all"
                        >
                          Trocar
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={msg.text}
                      onChange={(e) => {
                        const updated = content.messages.map(
                          (m: any, i: number) =>
                            i === index ? { ...m, text: e.target.value } : m,
                        );
                        setContent((prev: any) => ({
                          ...prev,
                          messages: updated,
                        }));
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 transition-all"
                      placeholder="Texto da mensagem"
                    />
                    <input
                      type="text"
                      value={msg.time}
                      onChange={(e) => {
                        const updated = content.messages.map(
                          (m: any, i: number) =>
                            i === index ? { ...m, time: e.target.value } : m,
                        );
                        setContent((prev: any) => ({
                          ...prev,
                          messages: updated,
                        }));
                      }}
                      className="w-24 p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 transition-all"
                      placeholder="Hora (ex: 10:42)"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: [
                          ...msgs,
                          {
                            text: "Nova mensagem",
                            type: "sent",
                            time: "10:00",
                          },
                        ],
                      }));
                    }}
                    className="flex-1 p-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    + Mensagem enviada
                  </button>
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: [
                          ...msgs,
                          {
                            text: "Nova mensagem",
                            type: "received",
                            time: "10:00",
                          },
                        ],
                      }));
                    }}
                    className="flex-1 p-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    + Mensagem recebida
                  </button>
                </div>
                {(content.messages || []).length > 0 && (
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: msgs.slice(0, -1),
                      }));
                    }}
                    className="p-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    – Remover última
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTool === "text" && activeMode === "whatsapp" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) =>
                    handleInputChange("itemTitle", e.target.value)
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Ex: Maria"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mensagens
                </label>
                {(content.messages || []).map((msg: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          msg.type === "sent"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {msg.type === "sent" ? "Enviada" : "Recebida"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const updated = content.messages.map(
                              (m: any, i: number) =>
                                i === index
                                  ? {
                                      ...m,
                                      type:
                                        m.type === "sent" ? "received" : "sent",
                                    }
                                  : m,
                            );
                            setContent((prev: any) => ({
                              ...prev,
                              messages: updated,
                            }));
                          }}
                          className="text-[10px] text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded border border-gray-200 hover:border-gray-400 transition-all"
                        >
                          Trocar
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={msg.text}
                      onChange={(e) => {
                        const updated = content.messages.map(
                          (m: any, i: number) =>
                            i === index ? { ...m, text: e.target.value } : m,
                        );
                        setContent((prev: any) => ({
                          ...prev,
                          messages: updated,
                        }));
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 transition-all"
                      placeholder="Texto da mensagem"
                    />
                    <input
                      type="text"
                      value={msg.time}
                      onChange={(e) => {
                        const updated = content.messages.map(
                          (m: any, i: number) =>
                            i === index ? { ...m, time: e.target.value } : m,
                        );
                        setContent((prev: any) => ({
                          ...prev,
                          messages: updated,
                        }));
                      }}
                      className="w-24 p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-900 transition-all"
                      placeholder="Hora (ex: 10:42)"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: [
                          ...msgs,
                          {
                            text: "Nova mensagem",
                            type: "sent",
                            time: "10:00",
                          },
                        ],
                      }));
                    }}
                    className="flex-1 p-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    + Mensagem enviada
                  </button>
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: [
                          ...msgs,
                          {
                            text: "Nova mensagem",
                            type: "received",
                            time: "10:00",
                          },
                        ],
                      }));
                    }}
                    className="flex-1 p-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    + Mensagem recebida
                  </button>
                </div>
                {(content.messages || []).length > 0 && (
                  <button
                    onClick={() => {
                      const msgs = content.messages || [];
                      setContent((prev: any) => ({
                        ...prev,
                        messages: msgs.slice(0, -1),
                      }));
                    }}
                    className="p-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    – Remover última
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "spotify" && (
            <div className="flex flex-col gap-6">
              <h1>Capa do Álbum</h1>
              <div className="grid grid-cols-2 gap-2">
                {content.coverImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({ ...prev, coverImage: img }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "cover")}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <h1>Background:</h1>
                <button
                  onClick={() =>
                    setContent((prev: any) => ({
                      ...prev,
                      bgColor: "#808080",
                      bgImage: "",
                    }))
                  }
                  className="w-1/2 p-3 ml-10 bg-gray-100/50 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all"
                >
                  Padrão
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {content.bgImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({ ...prev, bgImage: img }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "bg")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "whatsapp" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Foto de Perfil
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.profileImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({
                        ...prev,
                        profileImage: img,
                      }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Background
                </h1>
                <button
                  onClick={() =>
                    setContent((prev: any) => ({
                      ...prev,
                      bgColor: "",
                      bgImage: "/wppback.jpg",
                    }))
                  }
                  className="ml-auto px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
                >
                  Padrão
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {content.bgImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({ ...prev, bgImage: img }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "bg")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "instagram" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Foto de Perfil
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.profileImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({
                        ...prev,
                        profileImage: img,
                      }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Background
                </h1>
                <button
                  onClick={() =>
                    setContent((prev: any) => ({
                      ...prev,
                      bgColor: "#ffffff",
                      bgImage: "",
                    }))
                  }
                  className="ml-auto px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
                >
                  Padrão
                </button>
              </div>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "letterboxd" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <h1>Background:</h1>
                <button
                  onClick={() =>
                    setContent((prev: any) => ({
                      ...prev,
                      bgColor: "#808080",
                      bgImage: "",
                    }))
                  }
                  className="w-1/2 p-3 ml-10 bg-gray-100/50 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all"
                >
                  Padrão
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {content.bgImages.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({ ...prev, bgImage: img }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "bg")}
                    className="hidden"
                  />
                </label>
              </div>
              <h1>Imagem de capa:</h1>
              <div className="grid grid-cols-2 gap-2">
                {content.posterImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({ ...prev, posterImage: img }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "poster")}
                    className="hidden"
                  />
                </label>
              </div>
              <h1>Foto de perfil:</h1>
              <div className="grid grid-cols-2 gap-2">
                {content.profileImages?.map((img: any, index: any) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev: any) => ({
                        ...prev,
                        profileImage: img,
                      }))
                    }
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-900 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Download className="w-6 h-6 rotate-180" />
                    <span className="text-sm font-medium">Fazer Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "profile")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTool === "style" && activeMode !== "instagram" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cor do Conteúdo
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: content.contentColor }}
                  ></div>
                  <input
                    type="color"
                    value={content.contentColor}
                    onChange={(e) =>
                      setContent((prev: any) => ({
                        ...prev,
                        contentColor: e.target.value,
                      }))
                    }
                    className="flex-1 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cor do Fundo
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: content.bgColor }}
                  ></div>
                  <input
                    type="color"
                    value={content.bgColor}
                    onChange={(e) =>
                      setContent((prev: any) => ({
                        ...prev,
                        bgColor: e.target.value,
                      }))
                    }
                    className="flex-1 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Efeito Glassmorphism
                </label>
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="checkbox"
                    checked={content.glassmorphism}
                    onChange={(e) =>
                      setContent((prev: any) => ({
                        ...prev,
                        glassmorphism: e.target.checked,
                      }))
                    }
                    className="h-10 w-10 rounded-lg cursor-pointer bg-transparent"
                  />
                  {content.glassmorphism && (
                    <input
                      type="color"
                      value={content.glassColor}
                      onChange={(e) =>
                        setContent((prev: any) => ({
                          ...prev,
                          glassColor: e.target.value,
                        }))
                      }
                      className="flex-1 h-10 rounded-lg cursor-pointer bg-transparent "
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="font-medium text-gray-900 w-24 md:w-auto bg-transparent border-none focus:outline-none"
              placeholder="Título"
            />
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden md:inline">Salvar</span>
              </button>
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Undo className="w-5 h-5" />
            </button>
            <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Redo className="w-5 h-5" />
            </button>
            <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
            >
              {loadingDownload ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Exportar
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div
          ref={divRef}
          className="flex-1 bg-gray-100 flex items-center justify-center p-4 md:p-12 overflow-hidden relative"
          onClick={() => {
            if (window.innerWidth < 768) setActiveTool(null);
          }}
        >
          <div
            style={{ transform: `scale(${zoom})` }}
            className="origin-center transition-transform duration-300"
          >
            {activeMode === "spotify" && (
              <SpotifyCanvas
                ref={canvasRef}
                content={content}
                handleBlur={handleBlur}
              />
            )}
            {activeMode === "letterboxd" && (
              <LetterboxdCanvas content={content} handleBlur={handleBlur} />
            )}
            {activeMode === "whatsapp" && (
              <WhatsappCanvas content={content} handleBlur={handleBlur} />
            )}
            {activeMode === "instagram" && (
              <InstagramCanvas content={content} handleBlur={handleBlur} />
            )}
          </div>
        </div>
        {/* Zoom */}
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-1.5 flex items-center gap-1">
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
            onClick={handleInputZoomMinus}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-700 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
            onClick={handleInputZoomPlus}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded ml-1"
            onClick={handleInputZoomNormal}
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
