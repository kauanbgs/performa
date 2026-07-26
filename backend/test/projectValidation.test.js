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
