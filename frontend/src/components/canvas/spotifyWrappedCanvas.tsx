import { forwardRef } from "react";

const SpotifyWrappedCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[390px] h-[780px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none rounded-t-[32px] rounded-b-[32px]"
        style={{ backgroundColor: "#222222", fontFamily: "Inter, -apple-system, sans-serif" }}
      >
        {/* Top Banner Image */}
        <div className="w-full h-[250px] bg-black shrink-0">
          {content.coverImage ? (
            <img src={content.coverImage} alt="banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#121212]" />
          )}
        </div>
        
        {/* Divider Line */}
        <div className="w-full h-1 bg-[#8e6125] shrink-0"></div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col px-7 pt-5 pb-10">
          
          {/* Header Row */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.16 9.6C16.32 7.32 9.48 7.14 5.52 8.34c-.6.181-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.56-1.38 12.06-1.14 16.5 1.5.54.3.72.96.42 1.5-.24.54-.9.72-1.44.42z"/>
              </svg>
              <span className="text-white text-[13px] font-bold tracking-tight">Spotify Premium</span>
            </div>
            <span className="text-white/90 text-[13px]">{content.date || "May 5, 2026"}</span>
          </div>

          {/* Title */}
          <h1 className="text-white text-[44px] font-bold leading-[1.05] mt-8 tracking-[-0.03em] whitespace-pre-line">
            {content.title || "My May Sound\nCapsule"}
          </h1>

          {/* Lists Grid */}
          <div className="grid grid-cols-2 gap-x-2 mt-8">
            {/* Top Artists */}
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-[18px] font-bold mb-1">Top artists</h2>
              <div className="text-white text-[16px] leading-[1.6]">
                <div>1 {content.artist || "Guns N' Roses"}</div>
                <div>2 {content.artist2 || "Black Sabbath"}</div>
                <div>3 {content.artist3 || "The Rolling Stones"}</div>
                <div>4 {content.artist4 || "Radiohead"}</div>
                <div>5 {content.artist5 || "Bon Jovi"}</div>
              </div>
            </div>
            
            {/* Top Songs */}
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-[18px] font-bold mb-1">Top songs</h2>
              <div className="text-white text-[16px] leading-[1.6]">
                <div className="truncate">1 {content.itemTitle || "November Rain"}</div>
                <div className="truncate">2 {content.song2 || "Electric Funeral - ..."}</div>
                <div className="truncate">3 {content.song3 || "Beat It"}</div>
                <div className="truncate">4 {content.song4 || "Bad Medicine"}</div>
                <div className="truncate">5 {content.song5 || "Piano Bar - Ao Vivo"}</div>
              </div>
            </div>
          </div>

          {/* Time Listened */}
          <div className="mt-auto">
            <h2 className="text-white text-[18px] font-bold mb-1 tracking-tight">Time listened</h2>
            <p className="text-[#6df09b] text-[38px] font-bold tracking-tight leading-none">
              {content.followers || "208"} minutes
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default SpotifyWrappedCanvas;