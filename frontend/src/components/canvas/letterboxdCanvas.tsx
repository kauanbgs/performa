import { Star } from "lucide-react";
import { forwardRef } from "react";

const LetterboxdCanvas = forwardRef<
  HTMLDivElement,
  { content: any; handleBlur: any }
>(({ content, handleBlur }, ref) => {
  return (
    <div
      ref={ref}
      style={
        content.bgImage
          ? {
              backgroundImage: `url(${content.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: content.bgColor }
      }
      className="w-[500px] h-[700px] shadow-2xl flex flex-col items-center justify-center p-12 text-center relative pointer-events-none select-none"
    >
      <div
        className="w-75 h-110 rounded-xl pointer-events-auto select-text transition-colors duration-300 justify-center flex mb-20"
        style={{
          backgroundImage: `url(${content.posterImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <header>
          <img
            className="rounded-full w-14 h-14 object-cover mt-[-40px]"
            src={content.profileImage}
            alt=""
          />
        </header>
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            handleBlur("itemTitle", e.currentTarget.innerText || "")
          }
          className="font-primary text-xl text-white font-secondary font-semibold leading-[1.1] absolute bottom-33 outline-none focus:bg-white/10 rounded px-1 transition-colors"
        >
          {content.itemTitle}
        </h1>
        <section className="absolute bottom-25 flex gap-1">
          {Array.from({ length: content.rating }).map((_, index) => (
            <Star
              key={index}
              className="w-5 h-5 text-green-500 fill-green-500"
            />
          ))}
        </section>
        <footer className="ml-4 absolute top-142 mr-4 flex flex-col items-center">
          <div className="flex items-center gap-1 absolute top-12">
            <div className="w-20 h-[.5px] bg-[#a3a0a0]"></div>
            <h1 className="text-[#a3a0a0] text-sm font-secondary font-semibold">
              ON
            </h1>
            <div className="w-20 h-[.5px] bg-[#a3a0a0]"></div>
          </div>
          <img
            className="w-40 h-40 mr-3 mb-3"
            src="/letterboxd.png"
            alt="letterboxd"
          />
        </footer>
      </div>
    </div>
  );
});

export default LetterboxdCanvas;
