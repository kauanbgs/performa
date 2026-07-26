export type Mode = "spotify" | "letterboxd" | "whatsapp" | "instagram" | "spotifyWrapped";

// [width, height] do card exportado para cada template.
export const CANVAS_DIMENSIONS: Record<Mode, [number, number]> = {
  spotify: [500, 700],
  letterboxd: [500, 700],
  whatsapp: [390, 780],
  instagram: [390, 780],
  spotifyWrapped: [390, 780],
};

export const MODE_LABELS: Record<Mode, string> = {
  spotify: "Card de Música",
  letterboxd: "Review de Filme",
  whatsapp: "Chat do WhatsApp",
  instagram: "Direct do Instagram",
  spotifyWrapped: "Spotify Wrapped",
};

export const MODE_STYLES: Record<Mode, string> = {
  spotify: "bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-700",
  letterboxd: "bg-gradient-to-tr from-teal-100 to-green-100 text-teal-700",
  whatsapp: "bg-gradient-to-tr from-emerald-100 to-lime-100 text-emerald-700",
  instagram: "bg-gradient-to-tr from-pink-100 to-orange-100 text-pink-700",
  spotifyWrapped: "bg-gradient-to-tr from-orange-100 to-yellow-100 text-orange-700",
};
