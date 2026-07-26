const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidEmail, isStrongPassword } = require("../src/utils/validators");

test("isValidEmail aceita emails bem formados", () => {
  assert.equal(isValidEmail("user@example.com"), true);
  assert.equal(isValidEmail("user.name+tag@sub.example.com"), true);
});

test("isValidEmail rejeita entradas inválidas", () => {
  assert.equal(isValidEmail("nao-e-email"), false);
  assert.equal(isValidEmail("falta@dominio"), false);
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail(undefined), false);
  assert.equal(isValidEmail(123), false);
});

test("isStrongPassword exige tamanho mínimo", () => {
  assert.equal(isStrongPassword("1234567"), false);
  assert.equal(isStrongPassword("12345678"), true);
  assert.equal(isStrongPassword(undefined), false);
});
