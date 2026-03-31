import { forwardRef } from "react";
import { MessageCircle, Repeat2, Heart, Bookmark, Upload, BadgeCheck } from "lucide-react";

const TwitterCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>( 
  ({ content }, ref) => {
    
    // Configurações de fundo: pode ser imagem, cor da interface, ou glassmorphism.
    const bgStyle = content.bgImage
      ? { backgroundImage: `url(${content.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: content.bgColor || "#15202B" }; // Fundo padrão no Twitter Dim/Dark

    // Renderização com ou sem glassmorphism no card principal do tweet
    const cardClass = content.glassmorphism
      ? "bg-black/60 backdrop-blur-md border border-white/10"
      : "bg-black border border-gray-800"; // Black absoluto

    return (
      <div
        ref={ref}
        className="w-[500px] h-[700px] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden pointer-events-none select-none"
        style={{ ...bgStyle, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <div className={`w-[450px] rounded-2xl p-4 flex flex-col gap-3 text-white ${cardClass}`}>
          {/* Cabeçalho do Tweet */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[48px] h-[48px] rounded-full bg-gray-800 overflow-hidden flex items-center justify-center shrink-0">
                {content.profileImage ? (
                  <img src={content.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-[30px] h-[30px] text-gray-500 mt-2">
                    <circle cx="12" cy="8" r="4" fill="currentColor"/>
                    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" fill="currentColor"/>
                  </svg>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-bold leading-5 hover:underline cursor-pointer">
                    {content.itemTitle || "Nome do Usuário"}
                  </span>
                  {content.verified && (
                    <BadgeCheck className="w-[18px] h-[18px] text-[#1d9bf0]" fill="currentColor" stroke="white" />
                  )}
                </div>
                <span className="text-[15px] text-[#71767b] leading-5">
                  @{content.artist || "usuario"}
                </span>
              </div>
            </div>
            
            <button className="font-bold bg-white text-black px-4 py-1.5 rounded-full text-[14px]">
              Follow
            </button>
          </div>

          {/* Conteúdo do Tweet */}
          <div className="text-[17px] leading-6 whitespace-pre-wrap mt-1" style={{ color: content.contentColor || "#e7e9ea" }}>
            {content.lyrics || "Este é um exemplo de tweet. Você pode alterar este texto no menu lateral."}
          </div>

          {/* Data e Hora */}
          <div className="text-[#71767b] text-[15px] mt-1 flex items-center gap-1">
            <span>{content.time || "10:42 AM"}</span>
            <span className="px-1 text-[10px]">·</span>
            <span>{content.date || "29 Mar 26"}</span>
            <span className="px-1 text-[10px]">·</span>
            <span className="text-white font-bold">{content.views || "10.5K"}</span>
            <span> Views</span>
          </div>

          <div className="h-px w-full bg-[#2f3336] my-1" />

          {/* Ações / Métricas */}
          <div className="flex items-center justify-between text-[#71767b] px-1">
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="text-[13px]">{content.replies || "12"}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#00ba7c] transition-colors">
              <Repeat2 className="w-[20px] h-[20px]" strokeWidth={2} />
              <span className="text-[13px]">{content.posts || "144"}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#f91880] transition-colors">
              <Heart className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="text-[13px]">{content.followers || "1,200"}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors">
              <Bookmark className="w-[18px] h-[18px]" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1d9bf0] transition-colors">
              <Upload className="w-[18px] h-[18px]" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default TwitterCanvas;
