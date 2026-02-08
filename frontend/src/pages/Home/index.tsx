import { Navbar } from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { Music, Clapperboard, Quote, MoreHorizontal, Film } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfbf9] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-20">
          <h1 className="text-6xl md:text-7xl font-primary text-gray-900 mb-4">
            Olá, Ana.
          </h1>
          <p className="text-gray-400 font-secondary text-lg">
            O que vamos criar hoje?
          </p>
        </header>

        {/* Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {/* Card 1 */}
          <Link to="/editor" className="group cursor-pointer block">
            <Music className="w-8 h-8 text-gray-700 mb-4 stroke-[1.5]" />
            <h3 className="text-2xl font-primary text-gray-900 mb-2 font-medium">
              Post Musical
            </h3>
            <p className="text-gray-500 font-secondary text-sm leading-relaxed max-w-xs">
              Destaque letras, albuns ou músicas da forma em que você desejar.
            </p>
          </Link>

          {/* Card 2 */}
          <Link to="/editor" className="group cursor-pointer block">
            <Film className="w-8 h-8 text-gray-700 mb-4 stroke-[1.5]" />
            <h3 className="text-2xl font-primary text-gray-900 mb-2 font-medium">
              Post cinéfilo
            </h3>
            <p className="text-gray-500 font-secondary text-sm leading-relaxed max-w-xs">
              Poster Art, estrelas e críticas com o filme selecionado.
            </p>
          </Link>

          {/* Card 3 */}
          <Link to="/editor" className="group cursor-pointer block">
            <Quote className="w-8 h-8 text-gray-700 mb-4 stroke-[1.5]" />
            <h3 className="text-2xl font-primary text-gray-900 mb-2 font-medium">
              Citações
            </h3>
            <p className="text-gray-500 font-secondary text-sm leading-relaxed max-w-xs">
              Se sinta um filósofo.
            </p>
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Recent Projects (Left - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-primary text-gray-900">
                Projetos Recentes
              </h2>
              <button className="text-xs font-medium text-gray-400 hover:text-gray-900 tracking-wider transition-colors uppercase">
                Ver todos
              </button>
            </div>

            <div className="space-y-8">
              {/* Project Items */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center group cursor-pointer"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 mr-5 group-hover:bg-gray-100 transition-colors border border-gray-100">
                    <Clapperboard className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-primary text-xl text-gray-900 mb-1">
                      La La Land Review
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                      Cinema - Há 2 horas
                    </p>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inspiration (Right - 5 cols) */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-primary text-gray-900 mb-10">
              Inspiração
            </h2>
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] p-8 rounded-2xl text-white relative overflow-hidden group transition-transform hover:scale-[1.02]">
                <Quote className="w-10 h-10 text-gray-700 mb-4 stroke-[1] group-hover:text-gray-600 transition-colors" />
                <p className="font-primary text-xl italic mb-6 leading-relaxed text-gray-200">
                  "Design is intelligence made visible."
                </p>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">
                  Alina Wheeler
                </p>
              </div>

              <div className="bg-[#1a1a1a] p-8 rounded-2xl text-white relative overflow-hidden group transition-transform hover:scale-[1.02]">
                <Quote className="w-10 h-10 text-gray-700 mb-4 stroke-[1] group-hover:text-gray-600 transition-colors" />
                <p className="font-primary text-xl italic mb-6 leading-relaxed text-gray-200">
                  "Design is intelligence made visible."
                </p>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">
                  Alina Wheeler
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
