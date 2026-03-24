import { Link } from "react-router-dom";
import { Music, LayoutTemplate, Type, Smartphone } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../../components/layout/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);
  return (
    <div className="relative font-sans overflow-x-hidden">
      {/* Estilos Globais e Animações */}
      <style>{`
        :root {
          --font-primary: 'Playfair Display', serif;
          --font-secondary: 'Inter', sans-serif;
        }
        
        .font-primary { font-family: var(--font-primary); }
        .font-secondary { font-family: var(--font-secondary); }
        
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

      {/* Hero Section Wrapper */}
      <div className="min-h-screen flex flex-col">
        {/* Navegação */}
        <Navbar />

        {/* Conteúdo Principal */}
        <main className="flex-grow flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 relative z-10 py-10 lg:py-0 w-full">
          {/* Lado Esquerdo: Texto */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-20 lg:mb-0">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] text-gray-900 leading-none mb-6">
              <span className="block text-3xl md:text-4xl lg:text-[2.5rem] font-normal mb-2 text-gray-900 font-primary">
                aqui você
              </span>
              <span className="font-melodrame block text-[1.3em] md:text-[1.4em] mb-2 leading-[0.8]">
                performa
              </span>
              <span className="block text-3xl md:text-4xl font-normal text-right mr-10 lg:mr-32 text-gray-900 font-primary mt-6">
                muito mais.
              </span>
            </h1>

            <p className="max-w-md text-gray-800 text-sm md:text-base leading-relaxed font-secondary">
              Crie posts com estética editorial, reviews de cinema e cartões
              musicais em segundos. Minimalista, elegante e pronto para
              compartilhar.
            </p>

            {/* CTA Button — visível apenas no mobile */}
            <Link
              to="/login"
              className="mt-8 lg:hidden bg-[#222] text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-black transition-all hover:scale-105 font-primary tracking-wide shadow-lg font-secondary"
            >
              Começar agora →
            </Link>
          </div>

          {/* Lado Direito: Cards Flutuantes */}
          <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center perspective-1000">
            {/* Card 1: Deja Vu (Roxo) - Atrás Esquerda */}
            <div className="absolute bg-gradient-to-br from-[#f3e7ff] to-[#eaddff] p-6 rounded-2xl w-60 h-72 flex flex-col items-center justify-center text-center transform -rotate-12 -translate-x-24 z-10 border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:z-50 hover:rotate-0 hover:shadow-xl group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-300 to-pink-200 flex items-center justify-center mb-4 shadow-inner">
                <Music className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-1 text-gray-800 font-primary">
                Deja Vu
              </h3>
              <p className="text-xs text-gray-500 mb-6 px-2 italic font-secondary">
                "Car rides to Malibu, Strawberry ice cream"
              </p>

              {/* Player UI */}
              <div className="w-full px-2 mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                  <span>00:32</span>
                  <span>03:35</span>
                </div>
                <div className="h-1 w-full bg-gray-300/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800 w-1/3 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Card 2: Californication (Azul) - Atrás Direita */}
            <div className="absolute bg-gradient-to-br from-[#dcfce7] to-[#bae6fd] p-6 rounded-2xl w-60 h-72 flex flex-col items-center justify-center text-center transform rotate-12 translate-x-24 -translate-y-5 z-20 border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:z-50 hover:rotate-0 hover:shadow-xl group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-200 to-green-100 flex items-center justify-center mb-4 shadow-inner">
                <Music className="text-white w-8 h-8" />
              </div>
              <h3 className="text-xl mb-1 text-gray-800 font-primary">
                Californication
              </h3>
              <p className="text-xs text-gray-500 mb-6 px-2 italic font-secondary">
                "Marry me Girl, be my fairy to the world"
              </p>

              {/* Player UI */}
              <div className="w-full px-2 mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                  <span>01:15</span>
                  <span>05:21</span>
                </div>
                <div className="h-1 w-full bg-gray-300/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800 w-2/3 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Card 3: November Rain (Beige) - Frente Centro */}
            <div className="absolute bg-[#efe9d9] p-6 rounded-2xl w-64 h-80 flex flex-col items-center justify-center text-center transform rotate-3 translate-y-12 z-30 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-2xl group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-100 to-yellow-200 flex items-center justify-center mb-6 shadow-inner ring-4 ring-white/30">
                <Music className="text-gray-700 w-10 h-10" />
              </div>
              <h3 className="text-2xl mb-2 text-gray-800 tracking-tight font-primary">
                November Rain
              </h3>
              <p className="text-sm text-gray-600 mb-8 px-2 font-serif italic font-primary">
                “Nothing lasts forever Even cold november rain”
              </p>

              {/* Player UI */}
              <div className="w-full px-2 mt-auto">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-2">
                  <span>00:32</span>
                  <span>03:35</span>
                </div>
                <div className="h-1 w-full bg-gray-400/30 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-1/4 rounded-full relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
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
      <section className="w-full bg-white relative z-10 py-24">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
            {/* Item 1 */}
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <LayoutTemplate className="w-8 h-8 text-gray-700 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-primary text-gray-900 font-medium">
                Templates Clean
              </h3>
              <p className="text-gray-600 font-secondary leading-relaxed">
                Tudo o que você precisa para transformar pensamentos em arte
                visual.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Type className="w-8 h-8 text-gray-700 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-primary text-gray-900 font-medium">
                Textos Personalizados
              </h3>
              <p className="text-gray-600 font-secondary leading-relaxed">
                Crie legendas e textos com a sua cara, sem precisar se preocupar com a formatação.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Smartphone className="w-8 h-8 text-gray-700 stroke-[1.5]" />
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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-primary text-gray-900 mb-6">
            Pronto para Performar?
          </h2>
          <p className="text-gray-500 font-secondary text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Junte-se à comunidade de criadores que estão redefinindo a estética
            nas redes sociais.
          </p>
          <Link
            to="/login"
            className="bg-[#222] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-black transition-all hover:scale-105 inline-block font-primary tracking-wide"
          >
            Começar
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
