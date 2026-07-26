import { forwardRef } from "react";

/**
 * Nota do app Notas do iPhone — o formato da "nota de esclarecimento".
 * É o gênero em que se performa sinceridade: fundo branco, sem design,
 * como se o texto fosse espontâneo demais para ter sido diagramado.
 */
const NotesCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    // O modo escuro é o padrão real do gênero (quase todo mundo posta de
    // madrugada, com o celular no dark mode).
    const dark = content.glassmorphism !== false;

    const bg = dark ? "#000000" : "#FFFFFF";
    const text = content.contentColor || (dark ? "#FFFFFF" : "#1C1C1E");
    const muted = dark ? "#8E8E93" : "#8A8A8E";
    const bar = dark ? "#1C1C1E" : "#F9F9F9";
    const accent = "#E5A00D"; // amarelo do Notas

    const title = content.itemTitle || "Comunicado";
    const body =
      content.lyrics ||
      "Venho por meio desta esclarecer o ocorrido.\n\nNão foi minha intenção que as coisas tomassem essa proporção, e assumo total responsabilidade pelo que aconteceu.\n\nCom carinho,";
    const stamp = content.artist || "12 de março de 2026 às 03:14";

    return (
      <div
        ref={ref}
        className="w-[390px] h-[780px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none"
        style={{
          backgroundColor: bg,
          // Archivo vem empacotada com o app; sem ela o export (Chrome headless
          // no Linux) cairia numa fonte genérica diferente da do editor.
          fontFamily:
            "'Archivo Variable', -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
        }}
      >
        {/* Status bar do iOS */}
        <div
          className="flex items-center justify-between px-6 pt-3.5 pb-1.5 text-[14px] font-semibold"
          style={{ color: text }}
        >
          <span className="tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Sinal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={i * 4.5}
                  y={8 - i * 2.4}
                  width="3"
                  height={3 + i * 2.4}
                  rx="0.8"
                  fill={text}
                />
              ))}
            </svg>
            {/* Wi-Fi */}
            <svg width="16" height="11" viewBox="0 0 16 12" fill="none">
              <path
                d="M8 10.5l1.9-2.2a2.6 2.6 0 0 0-3.8 0L8 10.5z"
                fill={text}
              />
              <path
                d="M3.6 5.6a6.6 6.6 0 0 1 8.8 0"
                stroke={text}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M5.6 7.7a3.8 3.8 0 0 1 4.8 0"
                stroke={text}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Bateria */}
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="22"
                height="11"
                rx="3"
                stroke={text}
                strokeOpacity="0.4"
              />
              <rect x="2" y="2" width="19" height="8" rx="1.8" fill={text} />
              <path
                d="M24 4v4a2 2 0 0 0 0-4z"
                fill={text}
                fillOpacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Barra de navegação */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ backgroundColor: bar }}
        >
          <div className="flex items-center" style={{ color: accent }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path
                d="M10 2L2.5 10L10 18"
                stroke={accent}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[17px] ml-1.5">Notas</span>
          </div>
          <div className="flex items-center gap-5" style={{ color: accent }}>
            {/* Compartilhar */}
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <path
                d="M9 1.5v11M9 1.5L5.5 5M9 1.5L12.5 5"
                stroke={accent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 9H2v9h14V9h-1.5"
                stroke={accent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Nova nota */}
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path
                d="M12.5 2.5l4 4L6 17H2v-4L12.5 2.5z"
                stroke={accent}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {/* Mais */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke={accent} strokeWidth="1.6" />
              <circle cx="6" cy="10" r="1.2" fill={accent} />
              <circle cx="10" cy="10" r="1.2" fill={accent} />
              <circle cx="14" cy="10" r="1.2" fill={accent} />
            </svg>
          </div>
        </div>

        {/* Corpo da nota */}
        <div className="flex-1 px-5 pt-5 overflow-hidden">
          <h1
            className="text-[25px] font-bold leading-tight wrap-break-word"
            style={{ color: text }}
          >
            {title}
          </h1>
          <p className="text-[12px] mt-2 mb-4" style={{ color: muted }}>
            {stamp}
          </p>
          <p
            className="text-[16px] leading-[1.5] whitespace-pre-wrap wrap-break-word"
            style={{ color: text }}
          >
            {body}
          </p>
        </div>

        {/* Barra de ferramentas inferior */}
        <div
          className="flex items-center justify-between px-8 py-3.5"
          style={{ backgroundColor: bar, color: accent }}
        >
          {/* Checklist */}
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <circle cx="4" cy="5" r="3.2" stroke={accent} strokeWidth="1.5" />
            <circle cx="4" cy="15" r="3.2" stroke={accent} strokeWidth="1.5" />
            <path d="M10 5h9M10 15h9" stroke={accent} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          {/* Tabela */}
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <rect x="1.5" y="3" width="18" height="15" rx="2" stroke={accent} strokeWidth="1.5" />
            <path d="M1.5 8.5h18M8 3v15" stroke={accent} strokeWidth="1.5" />
          </svg>
          {/* Marcação */}
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path
              d="M13.5 2.5l5 5L7 19H2v-5L13.5 2.5z"
              stroke={accent}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {/* Câmera */}
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none">
            <rect x="1.5" y="5" width="19" height="13.5" rx="2.5" stroke={accent} strokeWidth="1.5" />
            <circle cx="11" cy="11.75" r="3.6" stroke={accent} strokeWidth="1.5" />
            <path d="M7.5 5l1.4-2.3h4.2L14.5 5" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="text-[17px] font-normal" style={{ color: accent }}>
            Concluído
          </span>
        </div>
      </div>
    );
  },
);

export default NotesCanvas;
