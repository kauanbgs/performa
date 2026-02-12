import { forwardRef } from "react";

const SpotifyCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content, handleBlur }, ref) => {
    return (
      <div ref={ref} style={content.bgImage ? { backgroundImage: `url(${content.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundColor: content.bgColor }} className="w-[500px] h-[700px] shadow-2xl flex flex-col items-center justify-center p-12 text-center relative pointer-events-none select-none">
      <div
              className="w-75 h-fit pb-25 rounded-3xl pointer-events-auto select-text transition-colors duration-300"
              style={
              content.glassmorphism
                ? {
                    backgroundColor: `${content.glassColor}33`, // transparência
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }
                : {
                    backgroundColor: content.contentColor,
                  }
            }
            >   
              <header className="text-left ml-6 mt-2 flex items-center gap-2">
                <div className="w-9 h-9 mb-2">
                  <img
                    className="rounded-sm w-full h-full object-cover"
                    src={content.coverImage}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <h1
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur("title", e.currentTarget.textContent || "")
                    }
                    className="font-primary text-[13px] text-black font-secondary font-bold leading-[1.1] mt-6 outline-none focus:bg-white/10 rounded px-1 -ml-1 transition-colors"
                  >
                    {content.title}
                  </h1>
                  <h2
                    contentEditable
                    spellCheck={false}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur("artist", e.currentTarget.textContent || "")
                    }
                    className="font-primary text-[10px] text-black font-secondary font-medium leading-[1.1] mb-8 mt-1 outline-none focus:bg-white/10 rounded px-1 -ml-1 transition-colors"
                  >
                    {content.artist}
                  </h2>
                </div>
              </header>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleBlur("lyrics", e.currentTarget.textContent || "")
                }
                className="font-primary text-xl w-60 text-black font-secondary font-bold leading-[1.3] text-left ml-5 mt-3 whitespace-pre-wrap outline-none focus:bg-white/10 rounded px-1 transition-colors"
                style={{ wordBreak: "break-word" }}
              >
                {content.lyrics}
              </p>
              <footer className="ml-4 absolute">
                <img className="w-28 h-28" src="spotify.png" alt="spotify" />
              </footer>
            </div>
          </div>
    )})
    
export default SpotifyCanvas;