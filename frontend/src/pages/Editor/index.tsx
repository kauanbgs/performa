import { Link, useParams } from "react-router-dom";
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Palette,
  Home,
  Film,
  Disc,
  Download,
  Save,
  Loader2,
  Maximize,
  ZoomIn,
  ZoomOut,
  Instagram,
  MessageCircle,
  Trash2,
  StickyNote,
  Twitter,
} from "lucide-react";
import "../../index.css";
import { useState, useRef, useEffect } from "react";
import SpotifyCanvas from "../../components/canvas/spotifyCanvas";
import LetterboxdCanvas from "../../components/canvas/letterboxdCanvas";
import api, { API_BASE_URL } from "../../services/axios";
import WhatsappCanvas from "../../components/canvas/whatsappCanvas";
import InstagramCanvas from "../../components/canvas/instagramCanvas";
import SpotifyWrappedCanvas from "../../components/canvas/spotifyWrappedCanvas";
import NotesCanvas from "../../components/canvas/notesCanvas";
import TweetCanvas from "../../components/canvas/tweetCanvas";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useToast } from "../../context/ToastContext";
import { CANVAS_DIMENSIONS, type Mode } from "../../constants/modes";

export default function Editor() {
  const token = useRequireAuth();
  const { showToast } = useToast();

  const { id } = useParams() as { id: string };

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await api.updateProject(token, id, { ...content, mode: activeMode});
    } catch (err) {
      console.error(err);
      showToast("Não foi possível salvar as alterações. Tente novamente.");
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
  const [loadingProject, setLoadingProject] = useState(true);
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
              projectData.previewImage || projectData.content.previewImage || "/transparente.jpg",
          });
          setActiveMode(projectData.mode);
          const [dimWidth, dimHeight] = CANVAS_DIMENSIONS[projectData.mode as Mode] ?? [500, 700];
          setWidth(dimWidth);
          setHeight(dimHeight);
        }
      })
      .catch((err: any) => {
        console.error("Erro ao carregar projeto:", err);
        showToast("Não foi possível carregar este projeto.");
      })
      .finally(() => setLoadingProject(false));
  }, [id, token, showToast]);

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
    const imagesKey = type + "Images" as keyof typeof content;
    const currentImages = (content[imagesKey] as string[]) || [];

    if (currentImages.length >= 2) {
      showToast("Você só pode adicionar até 2 imagens de cada tipo.");
      return;
    }

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
      showToast("Não foi possível enviar essa imagem. Tente novamente.");
    }
  };

  const handleImageDelete = (
    type: "cover" | "bg" | "poster" | "profile",
    index: number,
  ) => {
    const imagesKey = type + "Images" as keyof typeof content;
    const imageKey = type + "Image" as keyof typeof content;
    const currentImages = (content[imagesKey] as string[]) || [];

    const newImages = currentImages.filter((_, i) => i !== index);
    const activeImage = content[imageKey] as string;

    // Se a imagem deletada era a ativa, troca para a primeira disponível ou limpa
    let newActiveImage = activeImage;
    if (activeImage === currentImages[index]) {
      newActiveImage = newImages.length > 0 ? newImages[0] : "";
    }

    setContent((prev: any) => ({
      ...prev,
      [imagesKey]: newImages,
      [imageKey]: newActiveImage,
    }));
  };

  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(700);
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      // Salva antes de exportar
      await api.updateProject(token, id, { ...content, mode: activeMode });

      const response = await fetch(
        `${API_BASE_URL}/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...content, template: activeMode, width: width, height: height }),
        },
      );

      if (!response.ok) {
        console.error("Erro na exportação:", await response.text());
        showToast("Não foi possível gerar a imagem. Tente novamente.");
        return;
      }

      const blob = await response.blob();

      // Criar um arquivo a partir do blob para upload
      const file = new File([blob], "preview.png", { type: "image/png" });
      const previewUrl = await uploadImage(file);

      // Atualizar o estado e persistir no banco de dados
      setContent((prev: any) => {
        const updated = { ...prev, previewImage: previewUrl };
        api.updateProject(token, id, { ...updated, mode: activeMode }); // Salva no banco
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
      showToast("Não foi possível gerar a imagem. Tente novamente.");
    } finally {
      setLoadingDownload(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row h-dvh bg-gray-100 font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <aside className="w-full h-16 md:w-[72px] md:h-full bg-[#1a1a1a] flex flex-row md:flex-col items-center py-0 md:py-6 px-2 md:px-0 text-gray-400 z-30 shrink-0 justify-around md:justify-start">
        <Link
          to="/home"
          className="hidden md:flex mb-8 font-primary italic text-white text-2xl font-bold items-center justify-center "
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
            aria-label="Fechar painel"
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
                  const [w, h] = CANVAS_DIMENSIONS.spotify;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    itemTitle: "Nome da música",
                    artist: "Nome do artista",
                    lyrics: "Sua letra",
                    bgImage: "/fundoLogin.png",
                    contentColor: "#000000",
                    glassmorphism: true,
                  }));
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
                  const [w, h] = CANVAS_DIMENSIONS.letterboxd;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    itemTitle: "Nome do filme",
                    bgImage: "/fundoLogin.png",
                  }));
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
                  const [w, h] = CANVAS_DIMENSIONS.whatsapp;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    itemTitle: "Kauan Plaza",
                    bgImage: "/wppback.jpg",
                  }));
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
                  const [w, h] = CANVAS_DIMENSIONS.instagram;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    bgColor: "#FFFFFF",
                    bgImage: "",
                    itemTitle: "Kauan Plaza",
                    followers: "344",
                    posts: "0",
                  }));
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
              <button
                onClick={() => {
                  setActiveMode("spotifyWrapped");
                  const [w, h] = CANVAS_DIMENSIONS.spotifyWrapped;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    bgColor: "#FFFFFF",
                    bgImage: "",
                    itemTitle: "Kauan Plaza",
                    followers: "344",
                    posts: "0",
                  }));
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "spotifyWrapped" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <Disc className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Spotify Wrapped
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveMode("notes");
                  const [w, h] = CANVAS_DIMENSIONS.notes;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    itemTitle: "Comunicado",
                    artist: "12 de março de 2026 às 03:14",
                    lyrics:
                      "Venho por meio desta esclarecer o ocorrido.\n\nNão foi minha intenção que as coisas tomassem essa proporção, e assumo total responsabilidade pelo que aconteceu.\n\nCom carinho,",
                    glassmorphism: true,
                    contentColor: "",
                  }));
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "notes" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <StickyNote className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Nota de Esclarecimento
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveMode("tweet");
                  const [w, h] = CANVAS_DIMENSIONS.tweet;
                  setWidth(w);
                  setHeight(h);
                  setContent((prev: any) => ({
                    ...prev,
                    itemTitle: "Seu Nome",
                    artist: "@seuusuario",
                    lyrics:
                      "eu não deveria estar postando isso às 3 da manhã mas enfim",
                    glassmorphism: true,
                    contentColor: "",
                  }));
                }}
                className="col-span-1 flex flex-col gap-2 group cursor-pointer"
              >
                <div
                  className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "tweet" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}
                >
                  <Twitter className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Print de Tweet
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

          {activeTool === "text" && activeMode === "notes" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Título da nota
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) => handleInputChange("itemTitle", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Comunicado"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Data e hora
                </label>
                <input
                  type="text"
                  value={content.artist}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="12 de março de 2026 às 03:14"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Texto
                </label>
                <textarea
                  value={content.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all min-h-[200px] resize-y"
                  placeholder="Venho por meio desta esclarecer..."
                />
              </div>
              <button
                onClick={() =>
                  handleInputChange("glassmorphism", !(content.glassmorphism !== false) as any)
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-left"
              >
                {content.glassmorphism !== false ? "Modo escuro" : "Modo claro"}
                <span className="text-gray-400"> · toque para alternar</span>
              </button>
            </div>
          )}

          {activeTool === "text" && activeMode === "tweet" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nome
                </label>
                <input
                  type="text"
                  value={content.itemTitle}
                  onChange={(e) => handleInputChange("itemTitle", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Seu Nome"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Usuário
                </label>
                <input
                  type="text"
                  value={content.artist}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="@seuusuario"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tweet
                </label>
                <textarea
                  value={content.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all min-h-[120px] resize-y"
                  placeholder="O que está acontecendo?"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Reposts
                  </label>
                  <input
                    type="number"
                    value={content.followers ?? ""}
                    onChange={(e) => handleInputChange("followers", e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                    placeholder="2400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Curtidas
                  </label>
                  <input
                    type="number"
                    value={content.likes ?? ""}
                    onChange={(e) => handleInputChange("likes", e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                    placeholder="18300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Respostas
                  </label>
                  <input
                    type="number"
                    value={content.posts ?? ""}
                    onChange={(e) => handleInputChange("posts", e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                    placeholder="128"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleInputChange("rating", (content.rating === 0 ? 5 : 0) as any)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-left"
                >
                  {content.rating === 0 ? "Sem selo de verificado" : "Com selo de verificado"}
                  <span className="text-gray-400"> · toque para alternar</span>
                </button>
                <button
                  onClick={() =>
                    handleInputChange("glassmorphism", !(content.glassmorphism !== false) as any)
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-left"
                >
                  {content.glassmorphism !== false ? "Modo escuro" : "Modo claro"}
                  <span className="text-gray-400"> · toque para alternar</span>
                </button>
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


          {activeTool === "text" && activeMode === "spotifyWrapped" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Título (com \n para quebra de linha)
                </label>
                <textarea
                  value={content.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all min-h-[80px]"
                  placeholder="Ex: My May Sound\nCapsule"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Data
                </label>
                <input
                  type="text"
                  value={content.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Ex: May 5, 2026"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Minutos Ouvidos
                </label>
                <input
                  type="text"
                  value={content.followers}
                  onChange={(e) => handleInputChange("followers", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Ex: 208"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Top Artistas (1 ao 5)
                </label>
                <input type="text" value={content.artist} onChange={(e) => handleInputChange("artist", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="1 Guns N' Roses" />
                <input type="text" value={content.artist2} onChange={(e) => handleInputChange("artist2", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="2 Black Sabbath" />
                <input type="text" value={content.artist3} onChange={(e) => handleInputChange("artist3", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="3 The Rolling Stones" />
                <input type="text" value={content.artist4} onChange={(e) => handleInputChange("artist4", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="4 Radiohead" />
                <input type="text" value={content.artist5} onChange={(e) => handleInputChange("artist5", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all" placeholder="5 Bon Jovi" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Top Músicas (1 ao 5)
                </label>
                <input type="text" value={content.itemTitle} onChange={(e) => handleInputChange("itemTitle", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="1 November Rain" />
                <input type="text" value={content.song2} onChange={(e) => handleInputChange("song2", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="2 Electric Funeral" />
                <input type="text" value={content.song3} onChange={(e) => handleInputChange("song3", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="3 Beat It" />
                <input type="text" value={content.song4} onChange={(e) => handleInputChange("song4", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all mb-1" placeholder="4 Bad Medicine" />
                <input type="text" value={content.song5} onChange={(e) => handleInputChange("song5", e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all" placeholder="5 Piano Bar" />
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, coverImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("cover", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, bgImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("bg", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, profileImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("profile", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, bgImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("bg", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

          {activeTool === "uploads" && activeMode === "tweet" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Foto de Perfil
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.profileImages?.map((img: any, index: any) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Foto de perfil enviada ${index + 1}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, profileImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("profile", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Remover imagem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Imagem do Tweet
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.coverImages?.map((img: any, index: any) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Imagem do tweet enviada ${index + 1}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, coverImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("cover", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Remover imagem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
              <button
                onClick={() => setContent((prev: any) => ({ ...prev, coverImage: "" }))}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Tweet sem imagem
              </button>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "notes" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500 leading-relaxed">
                A nota é só texto — é isso que faz o formato parecer espontâneo.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Use a aba <strong className="text-gray-900">Texto</strong> para escrever
                o comunicado e alternar entre modo claro e escuro.
              </p>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "instagram" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Foto de Perfil
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.profileImages?.map((img: any, index: any) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, profileImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("profile", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                {content.bgImages?.map((img: any, index: any) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, bgImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("bg", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, posterImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("poster", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, profileImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("profile", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

          {activeTool === "uploads" && activeMode === "spotifyWrapped" && (
            <div className="flex flex-col gap-6">
              <h1 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Capa do Banner
              </h1>
              <div className="grid grid-cols-2 gap-2">
                {content.coverImages?.map((img: any, index: any) => (
                  <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-900 transition-all">
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      onClick={() => setContent((prev: any) => ({ ...prev, coverImage: img }))}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleImageDelete("cover", index); }}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
          onWheel={(e) => {
            const delta = e.deltaY > 0 ? -0.02 : 0.02;
            setZoom((prev: number) => Math.min(Math.max(prev + delta, 0.2), 3));
          }}
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
            {activeMode === "spotifyWrapped" && (
              <SpotifyWrappedCanvas content={content} handleBlur={handleBlur} />
            )}
            {activeMode === "notes" && (
              <NotesCanvas content={content} handleBlur={handleBlur} />
            )}
            {activeMode === "tweet" && (
              <TweetCanvas content={content} handleBlur={handleBlur} />
            )}

          </div>
        </div>
        {/* Zoom */}
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-1.5 flex items-center gap-1">
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
            onClick={handleInputZoomMinus}
            aria-label="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-700 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
            onClick={handleInputZoomPlus}
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded ml-1"
            onClick={handleInputZoomNormal}
            aria-label="Restaurar zoom padrão"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
