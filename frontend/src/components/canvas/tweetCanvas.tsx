import { forwardRef } from "react";

/** Formata números como o X: 1200 -> "1,2 mil", 842000 -> "842 mil". */
function compact(value: unknown, fallback: number): string {
  const n = Number(value);
  const v = Number.isFinite(n) && n >= 0 ? n : fallback;
  // O X corta o decimal quando ele é zero: "842 mil", não "842,0 mil".
  const dec = (x: number) => x.toFixed(1).replace(/\.0$/, "").replace(".", ",");
  if (v >= 1_000_000) return `${dec(v / 1_000_000)} mi`;
  if (v >= 1_000) return `${dec(v / 1_000)} mil`;
  return String(v);
}

// O export roda em Chrome headless no Linux, onde as fontes da Apple e da
// Microsoft não existem. Archivo é empacotada com o app, então a imagem
// baixada sai igual ao que se vê no editor.
const UI_STACK =
  "'Archivo Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

/**
 * Post do X (Twitter) no modo escuro — o "print de tweet", provavelmente o
 * artefato mais recortado e recompartilhado da internet.
 */
const TweetCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    const light = content.glassmorphism === false;

    const bg = light ? "#FFFFFF" : "#000000";
    const text = content.contentColor || (light ? "#0F1419" : "#E7E9EA");
    const muted = light ? "#536471" : "#71767B";
    const line = light ? "#EFF3F4" : "#2F3336";
    const blue = "#1D9BF0";

    const name = content.itemTitle || "Seu Nome";
    const handle = (content.artist || "@seuusuario").replace(/^@?/, "@");
    const body = content.lyrics || "eu não deveria estar postando isso às 3 da manhã mas enfim";
    const verified = content.rating !== 0;

    const replies = compact(content.posts, 128);
    const reposts = compact(content.followers, 2400);
    const likes = compact(content.likes, 18300);

    const icon = (path: string, extra?: string) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path
          d={path}
          stroke={muted}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {extra && (
          <path
            d={extra}
            stroke={muted}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    );

    return (
      <div
        ref={ref}
        /* Altura automática: o export recorta pelo boundingBox real do
           elemento, então o print sai justo no tweet — curto ou longo — em
           vez de carregar uma faixa preta vazia embaixo. */
        className="w-[500px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none"
        style={{ backgroundColor: bg, fontFamily: UI_STACK }}
      >
        <div className="flex flex-col px-5 pt-5">
          {/* Cabeçalho: avatar, nome, arroba */}
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-12 h-12 rounded-full overflow-hidden"
              style={{ backgroundColor: line }}
            >
              {content.profileImage ? (
                <img
                  src={content.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[20px] font-bold"
                  style={{ color: muted }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span
                  className="text-[16px] font-bold leading-tight truncate"
                  style={{ color: text }}
                >
                  {name}
                </span>
                {verified && (
                  <svg width="18" height="18" viewBox="0 0 22 22" className="shrink-0">
                    <path
                      fill={blue}
                      d="M20.4 11a3 3 0 0 0-1.7-2.7 3 3 0 0 0-.8-3.2 3 3 0 0 0-3.2-.8A3 3 0 0 0 11 1.6a3 3 0 0 0-2.7 1.7 3 3 0 0 0-3.2.8 3 3 0 0 0-.8 3.2A3 3 0 0 0 1.6 11a3 3 0 0 0 1.7 2.7 3 3 0 0 0 .8 3.2 3 3 0 0 0 3.2.8 3 3 0 0 0 2.7 1.7 3 3 0 0 0 2.7-1.7 3 3 0 0 0 3.2-.8 3 3 0 0 0 .8-3.2A3 3 0 0 0 20.4 11z"
                    />
                    <path
                      d="M9.8 14.4l-2.9-2.9 1.2-1.2 1.7 1.7 4.1-4.1 1.2 1.2-5.3 5.3z"
                      fill={bg}
                    />
                  </svg>
                )}
              </div>
              <span className="text-[15px] leading-tight truncate" style={{ color: muted }}>
                {handle}
              </span>
            </div>

            {/* Reticências */}
            <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
              <circle cx="4" cy="10" r="1.6" fill={muted} />
              <circle cx="10" cy="10" r="1.6" fill={muted} />
              <circle cx="16" cy="10" r="1.6" fill={muted} />
            </svg>
          </div>

          {/* Texto do tweet */}
          <p
            className="text-[21px] leading-[1.35] mt-3.5 whitespace-pre-wrap wrap-break-word"
            style={{ color: text }}
          >
            {body}
          </p>

          {/* Imagem anexada, se houver */}
          {content.coverImage && (
            <div
              className="mt-3.5 rounded-2xl overflow-hidden border"
              style={{ borderColor: line, maxHeight: 190 }}
            >
              <img
                src={content.coverImage}
                alt=""
                className="w-full object-cover"
                style={{ maxHeight: 190 }}
              />
            </div>
          )}

          {/* Horário e origem */}
          <div className="text-[14px] mt-3.5" style={{ color: muted }}>
            3:14 AM · 12 de mar de 2026 ·{" "}
            <span style={{ color: text }} className="font-semibold">
              {compact(content.views, 842000)}
            </span>{" "}
            visualizações
          </div>

          <div className="h-px my-3" style={{ backgroundColor: line }} />

          {/* Contadores */}
          <div className="flex items-center gap-5 text-[14px] flex-wrap" style={{ color: muted }}>
            <span>
              <span style={{ color: text }} className="font-semibold">
                {reposts}
              </span>{" "}
              Reposts
            </span>
            <span>
              <span style={{ color: text }} className="font-semibold">
                {likes}
              </span>{" "}
              Curtidas
            </span>
            <span>
              <span style={{ color: text }} className="font-semibold">
                {replies}
              </span>{" "}
              Respostas
            </span>
          </div>

          <div className="h-px my-3" style={{ backgroundColor: line }} />

          {/* Ações */}
          <div className="flex items-center justify-between pb-4">
            {icon("M20 11.5c0 4-3.6 7.2-8 7.2a9 9 0 0 1-2.5-.3L5 20l1.2-3.4A6.9 6.9 0 0 1 4 11.5c0-4 3.6-7.2 8-7.2s8 3.2 8 7.2z")}
            {icon("M6 5h10a3 3 0 0 1 3 3v4", "M16 19H6a3 3 0 0 1-3-3v-4M6 2.5L2.5 6 6 9.5M18 21.5l3.5-3.5-3.5-3.5")}
            {icon("M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7-1.3c0 4.9-7 13.3-7 13.3z")}
            {icon("M4 20V10M10 20V4M16 20v-7M22 20V7")}
            {icon("M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7", "M12 15V3M8.5 6.5L12 3l3.5 3.5")}
          </div>
        </div>
      </div>
    );
  },
);

export default TweetCanvas;
