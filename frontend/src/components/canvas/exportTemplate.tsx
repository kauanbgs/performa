import { useEffect, useRef, useState } from "react";
import SpotifyCanvas from "./spotifyCanvas";
import LetterboxdCanvas from "./letterboxdCanvas";
import WhatsappCanvas from "./whatsappCanvas";

interface ExportData {
  template: string;
  [key: string]: any;
}

export default function ExportTemplate() {
  const [data, setData] = useState<ExportData | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).INJECTED_EXPORT_DATA) {
      setData((window as any).INJECTED_EXPORT_DATA);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("data");
    if (raw) {
      setData(JSON.parse(decodeURIComponent(raw)));
    }
  }, []);

  if (!data) return null;

  return (
    <div id="capture">
      {data.template === "spotify" && (
        <SpotifyCanvas ref={canvasRef} content={data} handleBlur={() => {}} />
      )}
      {data.template === "letterboxd" && (
        <LetterboxdCanvas ref={canvasRef} content={data} handleBlur={() => {}} />
      )}
      {data.template === "whatsapp" && (
        <WhatsappCanvas ref={canvasRef} content={data} handleBlur={() => {}} />
      )}
    </div>
  );
}