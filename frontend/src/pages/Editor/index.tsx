import { Link } from "react-router-dom";
import {
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Home,
  Quote,
  Film,
  Disc,
  Undo,
  Redo,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import "../../index.css";
import { useState } from "react";
import SpotifyCanvas from "../../components/canvas/spotifyCanvas";
import LetterboxdCanvas from "../../components/canvas/letterboxdCanvas";

export default function Editor() {
  const [activeTool, setActiveTool] = useState("design");
  const [activeMode, setActiveMode] = useState("spotify ");
  const [content, setContent] = useState({
    title: "Fake Plastic Trees",
    artist: "Radiohead",
    lyrics: "She looks like the \nreal thing\nShe tastes like the \nreal thing",
    coverImage: "radiohead.jpg",
    bgImage: "transparente.jpg",
    glassmorphism: true,
    glassColor: "#ffffff",
    posterImage: "radiohead.jpg",
    profileImage: "radiohead.jpg",
    rating: 5,
    contentColor: "#000000",
    bgColor: "#9a6fe3",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "radiohead.jpg",
  ]);

  const handleBlur = (field: keyof typeof content, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof typeof content, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImages((prev) => [url, ...prev]);
      setContent((prev) => ({ ...prev, coverImage: url }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <aside className="w-[72px] bg-[#1a1a1a] flex flex-col items-center py-6 text-gray-400 z-20">
        <Link to="/home" className="mb-8 font-secondary italic text-white text-xl font-bold flex items-center justify-center">
          p.me
        </Link>

        <nav className="flex flex-col w-full gap-2">
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
        </nav>

        <div className="mt-auto">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* 2. Toolbox Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
            {activeTool === "design" && "Templates"}
            {activeTool === "text" && "Editor de Texto"}
            {activeTool === "uploads" && "Uploads"}
            {activeTool === "style" && "Estilo"}
            {activeTool === "elements" && "Elementos"}
          </h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTool === "design" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Template Item 1 */}
              <button onClick={() => setActiveMode("spotify")} className="col-span-1 flex flex-col gap-2 group cursor-pointer">
                <div className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "spotify" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}>
                  <Disc className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Spotify
                </span>
              </button>
              {/* Template Item 2 */}
              <button onClick={() => setActiveMode("letterboxd")} className="col-span-1 flex flex-col gap-2 group cursor-pointer">
                <div className={`aspect-[3/4] rounded-lg border-2 ${activeMode === "letterboxd" ? "border-gray-900" : "border-gray-200"} flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors`}>
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-900 text-center">
                  Fake Letterboxd
                </span>
              </button>
              
            </div>
          )} 
          {activeTool === "text" && (
            activeMode === "spotify" ? (
              <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Artista
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
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
              
            ) : (
              <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nome do filme
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                  placeholder="Nome do filme"
                />
              </div>
              
            </div>
            ) 
          )}

          {activeTool === "uploads" && activeMode === "spotify" && (
            <div className="flex flex-col gap-6">
              <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Download className="w-6 h-6 rotate-180" />
                  <span className="text-sm font-medium">Fazer Upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <h1>Capa do Álbum</h1>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev) => ({ ...prev, coverImage: img }))
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
              </div>
              <div className="flex items-center gap-2">
              <h1>Background:</h1>
              <button onClick={() => setContent((prev) => ({ ...prev, bgColor: "#808080", bgImage: "" }))} className="w-1/2 p-3 ml-10 bg-gray-100/50 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">Padrão</button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev) => ({ ...prev, bgImage: img }))
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
              </div>
            </div>
          )}

          {activeTool === "uploads" && activeMode === "letterboxd" && (
            <div className="flex flex-col gap-6">
              <label className="flex items-center justify-center w-full p-4 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Download className="w-6 h-6 rotate-180" />
                  <span className="text-sm font-medium">Fazer Upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <div className="flex items-center gap-2">
              <h1>Background:</h1>
              <button onClick={() => setContent((prev) => ({ ...prev, bgColor: "#808080", bgImage: "" }))} className="w-1/2 p-3 ml-10 bg-gray-100/50 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">Padrão</button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev) => ({ ...prev, bgImage: img }))
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
              </div>
              <h1>Imagem de capa:</h1>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev) => ({ ...prev, posterImage: img }))
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
              </div>
              <h1>Foto de perfil:</h1>
              <div className="grid grid-cols-2 gap-2">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setContent((prev) => ({ ...prev, profileImage: img }))
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
              </div>
            </div>
          )}

          {activeTool === "style" && (
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
                      setContent((prev) => ({
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
                      setContent((prev) => ({
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
                      setContent((prev) => ({
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
                        setContent((prev) => ({
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
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Fake Spotify</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>{" "}
              Salvo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Undo className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Redo className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-12 overflow-hidden relative">
            {activeMode === "spotify" && (
              <SpotifyCanvas content={content} handleBlur={handleBlur} />
            )}
            {activeMode === "letterboxd" && (
              <LetterboxdCanvas content={content} handleBlur={handleBlur} />
            )}
          </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-1.5 flex items-center gap-1">
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-gray-700 w-10 text-center">
            100%
          </span>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded ml-1">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
