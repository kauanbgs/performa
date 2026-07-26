const ALLOWED_MODES = ["free", "spotify", "letterboxd", "whatsapp", "instagram", "spotifyWrapped"];
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_BYTES = 200 * 1024;

function validateProjectInput({ title, mode, content }) {
  if (typeof title !== "string" || title.trim().length === 0) {
    return "Todos os campos devem ser preenchidos";
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return `O título deve ter no máximo ${MAX_TITLE_LENGTH} caracteres.`;
  }
  if (mode !== undefined && !ALLOWED_MODES.includes(mode)) {
    return `mode inválido. Valores aceitos: ${ALLOWED_MODES.join(", ")}.`;
  }
  if (content && Buffer.byteLength(JSON.stringify(content), "utf8") > MAX_CONTENT_BYTES) {
    return "Conteúdo do projeto excede o tamanho máximo permitido.";
  }
  return null;
}

module.exports = { validateProjectInput, ALLOWED_MODES, MAX_TITLE_LENGTH, MAX_CONTENT_BYTES };
