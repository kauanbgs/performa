import { useEffect, useRef, useState } from "react";
import SpotifyCanvas from "./spotifyCanvas";

export default function ExportTemplate() {
  const [data, setData] = useState(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("data");
    if (raw) {
      setData(JSON.parse(decodeURIComponent(raw)));
    }
  }, []);

  if (!data) return null;

  return (
    <div id="capture">
      <SpotifyCanvas ref={canvasRef} content={data} handleBlur={() => {}} />
    </div>
  );
}