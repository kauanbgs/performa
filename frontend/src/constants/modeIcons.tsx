import {
  Music,
  MessageCircle,
  Clapperboard,
  Instagram,
  Disc,
  StickyNote,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import type { Mode } from "./modes";

/**
 * Ícone de cada template. Fica separado de modes.ts porque importa
 * componentes React — assim modes.ts continua sendo só dados.
 */
export const MODE_ICONS: Record<Mode, LucideIcon> = {
  spotify: Music,
  letterboxd: Clapperboard,
  whatsapp: MessageCircle,
  instagram: Instagram,
  spotifyWrapped: Disc,
  notes: StickyNote,
  tweet: Twitter,
};

/** Ícone do template, com fallback para projetos de modo desconhecido. */
export function modeIcon(mode: string): LucideIcon {
  return MODE_ICONS[mode as Mode] ?? Clapperboard;
}
