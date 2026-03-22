import { Battery, ChevronLeft, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Search } from "lucide-react";
import { forwardRef } from "react";

const WhatsappCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    const messages: { text: string; type: "sent" | "received"; time: string }[] = content.messages || [
      { text: "Oi! Tudo bem?", type: "received", time: "10:42" },
      { text: "Tudo sim! E você?", type: "sent", time: "10:43" },
      { text: "Também! O que você vai fazer hoje?", type: "received", time: "10:44" },
      { text: content.lyrics || "Ainda não sei, talvez saia mais tarde 😄", type: "sent", time: "10:45" },
    ];

    const bgStyle = content.bgImage
      ? { backgroundImage: `url(${content.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: content.bgColor || "#e5ddd5" };

    return (
      <div
        ref={ref}
        className="w-[390px] h-[780px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none"
        style={{ backgroundColor: "#111b21", fontFamily: "'Segoe UI', sans-serif" }}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-white text-[12px] font-semibold bg-[#1f2c34]">
          <span>10:45</span>
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
            <span className="text-[11px]">100%</span>
          </div>
        </div>

        {/* Header / Chat Bar */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1f2c34]">
          <ChevronLeft className="text-[#aebac1] w-5 h-5 shrink-0" />
          {/* Profile photo */}
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#3c4a53] overflow-hidden">
            {content.profileImage ? (
              <img src={content.profileImage} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#aebac1] text-lg font-bold">
                {(content.itemTitle || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-white text-[15px] font-semibold leading-tight truncate">
              {content.itemTitle || "Contato"}
            </span>
            <span className="text-[#aebac1] text-[12px]">online</span>
          </div>
          <div className="flex items-center gap-4 text-[#aebac1]">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col gap-1.5 px-3 py-3 overflow-hidden" style={bgStyle}>
          {/* Date divider */}
          <div className="flex items-center justify-center my-1">
            <div className="bg-[#182229]/80 text-[#aebac1] text-[11px] px-3 py-0.5 rounded-full backdrop-blur-sm">
              Hoje
            </div>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-1.5 rounded-lg shadow-sm relative ${
                  msg.type === "sent"
                    ? "bg-[#005c4b] text-white rounded-br-sm"
                    : "bg-[#1f2c34] text-white rounded-bl-sm"
                }`}
              >
                {/* Message tail */}
                {msg.type === "sent" && (
                  <span
                    className="absolute -right-[7px] top-0 w-0 h-0"
                  />
                )}
                {msg.type === "received" && (
                  <span
                    className="absolute -left-[7px] top-0 w-0 h-0"
                  />
                )}
                <span className="text-[14px] leading-snug pr-10 mr-2 wrap-break-word">{msg.text}</span>
                <div className={`flex items-center gap-1 absolute bottom-1.5 right-2.5 ${msg.type === "sent" ? "text-[#aebac1]" : "text-[#aebac1]"}`}>
                  <span className="text-[10px]">{msg.time}</span>
                  {msg.type === "sent" && (
                    <svg viewBox="0 0 16 11" width="14" height="11" className="text-[#53bdeb] fill-current">
                      <path d="M11.071.653a.45.45 0 0 0-.304-.347.45.45 0 0 0-.483.13L4.741 7.1 1.926 4.287a.45.45 0 0 0-.636.636l3.13 3.13a.45.45 0 0 0 .637 0l6.014-6.68V1.37l-.63-.717zm2.565 0a.45.45 0 0 0-.304-.347.45.45 0 0 0-.483.13L7.307 7.1l-.636-.636a.45.45 0 1 0-.636.636l.954.954a.45.45 0 0 0 .636 0L13.636.99V.653z"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Input Bar */}
        <div className="flex items-center gap-2 px-2 py-2 bg-[#1f2c34]">
          <div className="flex items-center flex-1 bg-[#2a3942] rounded-full px-4 py-2.5 gap-2">
            <Smile className="w-5 h-5 text-[#aebac1] shrink-0" />
            <span className="flex-1 text-[#aebac1] text-[14px]">Mensagem</span>
            <Paperclip className="w-5 h-5 text-[#aebac1] shrink-0" />
          </div>
          <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    );
  }
);

export default WhatsappCanvas;