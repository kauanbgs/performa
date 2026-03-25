import { 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Bookmark, 
  Share, 
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";
import { forwardRef } from "react";

const TwitterCanvas = forwardRef<HTMLDivElement, { content: any; handleBlur: any }>(
  ({ content }, ref) => {
    const bgStyle = content.bgImage
      ? { backgroundImage: `url(${content.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: content.bgColor || "#000000" };

    const textColor = content.contentColor || "#ffffff";
    const mutedColor = "#71767b";

    return (
      <div
        ref={ref}
        className="w-[410px] h-fit min-h-[280px] shadow-2xl flex flex-col relative overflow-hidden pointer-events-none select-none p-4"
        style={{ ...bgStyle, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
      >
        <div className="flex flex-col gap-3">
          {/* Header: Profile and Info */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center shrink-0">
                {content.profileImage ? (
                  <img src={content.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-xl font-bold">
                        {(content.itemTitle || "X")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[16px]" style={{ color: textColor }}>
                    {content.itemTitle || "User Name"}
                  </span>
                  {content.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] stroke-black" />
                  )}
                </div>
                <span className="text-[15px]" style={{ color: mutedColor }}>
                  @{content.username || "username"}
                </span>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5" style={{ color: mutedColor }} />
          </div>

          {/* Tweet Content */}
          <div className="mt-1">
            <p className="text-[17px] leading-relaxed whitespace-pre-wrap wrap-break-word" style={{ color: textColor }}>
              {content.tweetText || "This is a fake tweet created with Performa! 🚀"}
            </p>
          </div>

          {/* Date and Views */}
          <div className="flex items-center gap-1 text-[15px] mt-2 pb-3 border-b border-gray-800" style={{ color: mutedColor }}>
            <span>{content.time || "10:00 PM"}</span>
            <span>·</span>
            <span>{content.date || "Oct 24, 2023"}</span>
            <span>·</span>
            <span className="font-bold" style={{ color: textColor }}>{content.views || "1.2M"}</span>
            <span>Views</span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-5 py-3 border-b border-gray-800 text-[15px]" style={{ color: mutedColor }}>
             <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: textColor }}>{content.retweets || "120"}</span>
                <span>Retweets</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: textColor }}>{content.quotes || "45"}</span>
                <span>Quotes</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: textColor }}>{content.likes || "2.4K"}</span>
                <span>Likes</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="font-bold" style={{ color: textColor }}>{content.bookmarks || "89"}</span>
                <span>Bookmarks</span>
             </div>
          </div>

          {/* Interaction Icons */}
          <div className="flex justify-between items-center px-4 py-1">
             <MessageCircle className="w-[22px] h-[22px]" style={{ color: mutedColor }} />
             <Repeat2 className="w-[22px] h-[22px]" style={{ color: mutedColor }} />
             <Heart className="w-[22px] h-[22px]" style={{ color: mutedColor }} />
             <Bookmark className="w-[22px] h-[22px]" style={{ color: mutedColor }} />
             <Share className="w-[22px] h-[22px]" style={{ color: mutedColor }} />
          </div>
        </div>
      </div>
    );
  }
);

TwitterCanvas.displayName = "TwitterCanvas";

export default TwitterCanvas;
