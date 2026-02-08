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

export default function Editor() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 1. Sidebar */}
      <aside className="w-[72px] bg-[#1a1a1a] flex flex-col items-center py-6 text-gray-400 z-20">
        <div className="mb-8 font-primary text-white text-2xl font-bold flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
          P.
        </div>

        <nav className="flex flex-col w-full gap-2">
          <button className="flex flex-col items-center gap-1.5 p-3 text-white bg-white/10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
            <LayoutTemplate className="w-5 h-5" />
            <span className="text-[10px] font-medium">Design</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors">
            <Type className="w-5 h-5" />
            <span className="text-[10px] font-medium">Texto</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Uploads</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">Elementos</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 p-3 hover:text-white hover:bg-white/5 transition-colors">
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

      {/* 2. Templates Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-sm tracking-wide">
            TEMPLATES
          </h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Template Item 1 */}
            <div className="col-span-1 flex flex-col gap-2 group cursor-pointer">
              <div className="aspect-[3/4] rounded-lg border-2 border-gray-900 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                <Disc className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">
                Fake Spotify
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Citação Editorial</span>
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
          {/* The Canvas */}
          <div className="bg-[#fcfbf7] w-[500px] h-[700px] shadow-2xl flex flex-col items-center justify-center p-12 text-center relative pointer-events-none select-none">
            <div className = "bg-[#9a6fe3] w-75 h-80 rounded-3xl">
              <header className="text-left ml-6 mt-2 flex items-center gap-2">
                <div className="w-9 h-9 mb-2">
                  <img className="rounded-sm" src="radiohead.jpg" alt="" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-primary text-[13px] text-black font-secondary font-bold leading-[1.1] mt-6 ">Fake Plastic Trees</h1>
                  <h2 className="font-primary text-[10px] text-black font-secondary font-medium leading-[1.1] mb-8 mt-1">Radiohead</h2>
                </div>
              </header>
              <p className="font-primary text-xl text-black font-secondary font-bold leading-[1.3] text-left ml-6 mt-1">
                She looks like the <br />real thing<br /> She tastes like the <br />real thing
              </p>
              <footer className="ml-4">
                <img className="w-28 h-28" src="spotify.png" alt="spotify" />
              </footer>
            </div>
          </div>
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
