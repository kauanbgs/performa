const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProjectInput } = require("../src/utils/projectValidation");

test("rejeita título vazio ou ausente", () => {
  assert.match(validateProjectInput({ title: "" }), /preenchidos/);
  assert.match(validateProjectInput({ title: "   " }), /preenchidos/);
  assert.match(validateProjectInput({}), /preenchidos/);
});

test("rejeita título maior que o limite", () => {
  const longTitle = "a".repeat(101);
  assert.match(validateProjectInput({ title: longTitle }), /máximo 100/);
});

test("aceita mode dentro da lista permitida", () => {
  assert.equal(validateProjectInput({ title: "Meu post", mode: "spotify" }), null);
  assert.equal(validateProjectInput({ title: "Meu post", mode: "spotifyWrapped" }), null);
});

test("aceita os templates novos (notes e tweet)", () => {
  assert.equal(validateProjectInput({ title: "Comunicado", mode: "notes" }), null);
  assert.equal(validateProjectInput({ title: "Tweet", mode: "tweet" }), null);
});

test("a lista de modes do backend cobre todos os templates do frontend", () => {
  // Se um template novo for criado no frontend sem ser liberado aqui, o
  // salvamento falha com 400 — este teste trava esse descompasso.
  const frontendModes = [
    "spotify",
    "letterboxd",
    "whatsapp",
    "instagram",
    "spotifyWrapped",
    "notes",
    "tweet",
  ];
  for (const mode of frontendModes) {
    assert.equal(
      validateProjectInput({ title: "x", mode }),
      null,
      `mode "${mode}" deveria ser aceito pelo backend`
    );
  }
});

test("rejeita mode fora da lista permitida", () => {
  assert.match(
    validateProjectInput({ title: "Meu post", mode: "admin" }),
    /mode inválido/
  );
});

test("rejeita content maior que o limite de bytes", () => {
  const hugeContent = { lyrics: "x".repeat(300 * 1024) };
  assert.match(
    validateProjectInput({ title: "Meu post", content: hugeContent }),
    /tamanho máximo/
  );
});

test("aceita payload válido completo", () => {
  assert.equal(
    validateProjectInput({ title: "Meu post", mode: "whatsapp", content: { lyrics: "ok" } }),
    null
  );
});
