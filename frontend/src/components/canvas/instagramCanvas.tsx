import { 
  Battery, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Video, 
  Camera, 
  Mic, 
  Image as ImageIcon, 
  Sticker, 
  PlusCircle,
  Signal
} from "lucide-react";
import { forwardRef } from "react";

const InstagramCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    // Mantendo a lógica de mensagens para que o componente seja funcional, 
    // mesmo que a imagem de exemplo esteja vazia.
    const messages: { text: string; type: "sent" | "received" }[] = content.messages || [];

    const bgStyle = content.bgImage
      ? { backgroundImage: `url(${content.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: content.bgColor || "#ffffff" };

    return (
      <div
        ref={ref}
        className="w-[390px] h-[780px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none"
        style={{ backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-black text-[14px] font-semibold bg-white z-10">
          <span>10:04</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-[12px] font-bold tracking-wider">4G</span>
            <Battery className="w-6 h-5" strokeWidth={2} />
          </div>
        </div>

        {/* Header / Chat Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <ChevronLeft className="text-black w-7 h-7 shrink-0 -ml-1" strokeWidth={1.5} />
            
            <div className="flex items-center gap-3 min-w-0">
              {/* Profile photo with active status */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {content.profileImage ? (
                    <img src={content.profileImage} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-400 mt-2">
                      <circle cx="12" cy="8" r="4" fill="currentColor"/>
                      <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" fill="currentColor"/>
                    </svg>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#78DE45] border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-black text-[16px] font-bold truncate">
                  {content.itemTitle || "Prankshit"}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-black shrink-0">
            <Phone className="w-6 h-6" strokeWidth={1.5} />
            <Video className="w-7 h-7" strokeWidth={1.5} />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white" style={bgStyle}>
          <div className="flex-1 overflow-y-auto pb-4">
            
            {/* Profile Summary Info */}
            <div className="flex flex-col items-center justify-center pt-8 pb-6 px-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-3 flex items-center justify-center">
                {content.profileImage ? (
                  <img src={content.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-20 h-20 text-gray-400 mt-4">
                    <circle cx="12" cy="8" r="4" fill="currentColor"/>
                    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22" fill="currentColor"/>
                  </svg>
                )}
              </div>
              <span className="text-[20px] font-bold text-black leading-tight">
                {content.itemTitle || "Prankshit"}
              </span>
              <span className="text-[15px] text-gray-500">
                {content.itemTitle || "Prankshit"}
              </span>
              <span className="text-[14px] text-gray-500 mt-0.5">
                {content.followers} followers · {content.posts} posts
              </span>
              <span className="text-[14px] text-gray-500 mt-0.5">
                You follow each other on Instagram
              </span>
              <button className="mt-4 bg-[#EFEFEF] hover:bg-gray-200 text-black text-[14px] font-semibold px-4 py-1.5 rounded-lg transition-colors">
                View profile
              </button>
            </div>

            {/* Messages (if any are added via content prop) */}
            <div className="flex flex-col gap-1 px-4">
              {messages.map((msg, index) => {
                const isFirstInGroup = index === 0 || messages[index - 1].type !== msg.type;
                const isLastInGroup = index === messages.length - 1 || messages[index + 1].type !== msg.type;
                
                return (
                  <div key={index} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-2" : ""}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2.5 text-[15px] leading-snug break-words ${
                        msg.type === "sent"
                          ? "bg-[#3797F0] text-white"
                          : "bg-[#EFEFEF] text-black"
                      }`}
                      style={{
                        borderRadius: "22px",
                        borderBottomRightRadius: msg.type === "sent" && !isLastInGroup ? "4px" : "22px",
                        borderTopRightRadius: msg.type === "sent" && !isFirstInGroup ? "4px" : "22px",
                        borderBottomLeftRadius: msg.type === "received" && !isLastInGroup ? "4px" : "22px",
                        borderTopLeftRadius: msg.type === "received" && !isFirstInGroup ? "4px" : "22px",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / Input Bar */}
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-2 px-3 py-2">
            {/* Camera Button */}
            <div className="w-[42px] h-[42px] bg-[#5B51D8] rounded-full flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            
            {/* Input Pill */}
            <div className="flex items-center flex-1 bg-[#F1F1F1] rounded-full pl-4 pr-2 py-2.5 gap-3">
              <span className="flex-1 text-gray-500 text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
                Message...
              </span>
              <div className="flex items-center gap-3 text-black">
                <Mic className="w-6 h-6" strokeWidth={1.5} />
                <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
                <Sticker className="w-6 h-6" strokeWidth={1.5} />
                <PlusCircle className="w-6 h-6" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* iOS Home Indicator */}
          <div className="w-full flex justify-center pb-2 pt-1 bg-white">
            <div className="w-[134px] h-[5px] bg-black rounded-full" />
          </div>
        </div>

      </div>
    );
  }
);

export default InstagramCanvas;