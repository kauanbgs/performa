import { Link } from "react-router-dom";
import {
  LayoutTemplate,
  Type,
  Smartphone,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  Film,
  BarChart3,
  Star,
  Heart,
} from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../../components/layout/Footer";
import MouseDotField from "../../components/effects/MouseDotField";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);
  return (
    <div className="relative font-sans overflow-x-clip">
      {/* Estilos Globais e Animações */}
      <style>{`
        
        /* Simulação da fonte customizada com fallback */
        .font-melodrame {
          font-family: 'Relationship of Melodrame', 'Playfair Display', serif;
          font-style: italic;
        }

        /* Animação do Marquee */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        /* Utilitários Específicos */
        .text-editorial {
          letter-spacing: -0.02em;
          line-height: 0.9;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Background Mesh Gradient */}
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 bg-[#fdfbf9]"
        style={{
          backgroundImage: `
            radial-gradient(at 10% 10%, rgba(168, 85, 247, 0.5) 0px, transparent 50%),
            radial-gradient(at 90% 10%, rgba(59, 130, 246, 0.5) 0px, transparent 50%),
            radial-gradient(at 30% 40%, rgba(20, 184, 166, 0.5) 0px, transparent 50%),
            radial-gradient(at 70% 80%, rgba(236, 72, 153, 0.5) 0px, transparent 50%),
            radial-gradient(at 5% 95%, rgba(249, 115, 22, 0.5) 0px, transparent 50%)
          `,
          filter: "blur(200px)",
        }}
      />

      {/* Campo de partículas com parallax de mouse */}
      <MouseDotField />

      {/* Hero Section Wrapper */}
      <div className="min-h-screen flex flex-col relative">
        {/* Navegação */}
        <Navbar />

        {/* Conteúdo Principal */}
        <main className="flex-grow flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 relative z-10 py-10 lg:py-0 w-full">
          {/* Lado Esquerdo: Texto */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-20 lg:mb-0">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-sm text-xs font-medium tracking-wide text-gray-700 font-secondary mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              crie, performe, compartilhe
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] text-gray-900 leading-none mb-6">
              <span className="block text-3xl md:text-4xl lg:text-[2.5rem] font-normal mb-2 text-gray-900 font-primary">
                aqui você
              </span>
              <span className="font-melodrame block text-[1.3em] md:text-[1.4em] mb-2 leading-[0.8]">
                performa
              </span>
              <span className="block text-3xl md:text-4xl font-normal text-right mr-10 lg:mr-32 text-gray-900 font-primary mt-6">
                sua estética.
              </span>
            </h1>

            <p className="max-w-md text-gray-800 text-sm md:text-base leading-relaxed font-secondary">
              Posts com estética editorial, reviews de cinema e cards musicais
              — criados em segundos e prontos pra qualquer feed. Sem precisar
              saber design.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 bg-[#222] text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-black transition-all hover:scale-105 font-secondary tracking-wide shadow-lg"
              >
                Criar minha arte
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#ferramentas"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-medium text-gray-800 border border-gray-300 hover:border-gray-900 hover:bg-white/60 transition-all font-secondary tracking-wide"
              >
                Ver exemplos
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs text-gray-500 font-secondary">
              <span>✓ grátis para começar</span>
              <span>✓ sem precisar de design</span>
              <span>✓ pronto em segundos</span>
            </div>
          </div>

          {/* Lado Direito: Cards Flutuantes em Glassmorphism */}
          <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center perspective-1000">
            {/* Card 1: Feed Post - Atrás Esquerda */}
            <div className="absolute bg-white/25 backdrop-blur-xl p-5 rounded-3xl w-56 h-64 flex flex-col text-left transform -rotate-12 -translate-x-24 z-10 border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:z-50 hover:rotate-0 hover:shadow-xl group">
              <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-purple-300/60 to-pink-200/60 flex items-center justify-center mb-3 border border-white/40">
                <ImageIcon className="text-white w-8 h-8 drop-shadow" />
              </div>
              <div className="h-2.5 w-4/5 bg-white/50 rounded-full mb-2"></div>
              <div className="h-2.5 w-3/5 bg-white/40 rounded-full mb-4"></div>
              <div className="flex items-center gap-1.5 mt-auto text-gray-600">
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span className="text-[11px] font-secondary">feed pronto</span>
              </div>
            </div>

            {/* Card 2: Cinema Review - Atrás Direita */}
            <div className="absolute bg-white/25 backdrop-blur-xl p-5 rounded-3xl w-56 h-64 flex flex-col text-left transform rotate-12 translate-x-24 -translate-y-5 z-20 border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:z-50 hover:rotate-0 hover:shadow-xl group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-300/60 to-blue-200/60 flex items-center justify-center mb-3 border border-white/40">
                <Film className="text-white w-5 h-5" />
              </div>
              <h3 className="text-lg mb-1 text-gray-800 font-primary">
                Crítica Rápida
              </h3>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <div className="h-2 w-full bg-white/40 rounded-full mb-1.5"></div>
              <div className="h-2 w-2/3 bg-white/40 rounded-full"></div>
            </div>

            {/* Card 3: Music Wrapped - Frente Centro */}
            <div className="absolute bg-white/30 backdrop-blur-xl p-6 rounded-3xl w-64 h-80 flex flex-col text-left transform rotate-3 translate-y-12 z-30 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-300/60 to-yellow-200/60 flex items-center justify-center mb-5 border border-white/40 shadow-inner">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl mb-1 text-gray-800 tracking-tight font-primary">
                Seu Wrapped
              </h3>
              <p className="text-xs text-gray-600 mb-6 font-secondary">
                top artista da temporada
              </p>

              {/* Mini gráfico */}
              <div className="flex items-end gap-2 h-20 mt-auto">
                {[40, 70, 45, 90, 60, 30].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-purple-400/70 to-pink-300/70"
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <a
          href="#ferramentas"
          className="hidden lg:flex flex-col items-center gap-1 self-center mb-8 text-gray-400 hover:text-gray-700 transition-colors relative z-10"
          aria-label="Rolar para ferramentas"
        >
          <span className="text-[10px] tracking-[0.2em] font-secondary uppercase">
            role
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>

      {/* Footer Marquee */}
      <footer className="w-full bg-white/80 border-t border-gray-200 py-6 overflow-hidden relative z-20">
        <div className="whitespace-nowrap animate-scroll">
          <span className="text-xs tracking-[0.3em] font-medium text-gray-400 inline-block font-secondary">
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            AESTHETIC - CULTURA - ARTE &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </footer>

      {/* Features Section */}
      <section id="ferramentas" className="w-full bg-white relative z-10 py-24">
        <div className="px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-primary text-gray-900 mb-6">
              Ferramentas de{" "}
              <span className="text-pink-500 italic font-medium">
                expressão
              </span>
            </h2>
            <p className="text-gray-500 font-secondary max-w-xl mx-auto text-lg">
              Tudo o que você precisa para transformar pensamentos em arte
              visual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Item 1 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
              <div className="p-3.5 rounded-xl bg-gradient-to-tr from-purple-100 to-pink-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <LayoutTemplate className="w-7 h-7 text-purple-700 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-primary text-gray-900 font-medium">
                Templates Clean
              </h3>
              <p className="text-gray-600 font-secondary leading-relaxed">
                Layouts prontos com estética editorial para você aplicar em
                segundos, sem esforço de design.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
              <div className="p-3.5 rounded-xl bg-gradient-to-tr from-blue-100 to-teal-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Type className="w-7 h-7 text-blue-700 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-primary text-gray-900 font-medium">
                Textos Personalizados
              </h3>
              <p className="text-gray-600 font-secondary leading-relaxed">
                Crie legendas e textos com a sua cara, sem precisar se preocupar com a formatação.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-start space-y-4 p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group">
              <div className="p-3.5 rounded-xl bg-gradient-to-tr from-orange-100 to-yellow-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-7 h-7 text-orange-700 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-primary text-gray-900 font-medium">
                Mobile First
              </h3>
              <p className="text-gray-600 font-secondary leading-relaxed">
                Uma interface que flui naturalmente no seu celular. Toque,
                arraste e crie sem fricção.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 w-full bg-[#fdfbf9] relative z-10">
        <div
          className="max-w-4xl mx-auto text-center rounded-[2.5rem] px-8 py-16 md:py-20 relative overflow-hidden border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          style={{
            backgroundImage: `
              radial-gradient(at 15% 20%, rgba(168, 85, 247, 0.18) 0px, transparent 55%),
              radial-gradient(at 85% 15%, rgba(59, 130, 246, 0.18) 0px, transparent 55%),
              radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.18) 0px, transparent 55%)
            `,
            backgroundColor: "#fff",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-primary text-gray-900 mb-6">
            Pronto para{" "}
            <span className="font-melodrame italic text-[1.05em]">
              performar
            </span>
            ?
          </h2>
          <p className="text-gray-500 font-secondary text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Junte-se à comunidade de criadores que estão redefinindo a estética
            nas redes sociais.
          </p>
          <Link
            to="/login"
            className="bg-[#222] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-black transition-all hover:scale-105 inline-block font-secondary tracking-wide shadow-lg"
          >
            Começar
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
