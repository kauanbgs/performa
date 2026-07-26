const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
const auth = require("../src/middlewares/auth");

function mockRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

test("rejeita requisição sem header de autorização", () => {
  const req = { headers: {} };
  const res = mockRes();
  let nextCalled = false;

  auth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test("rejeita token mal formatado", () => {
  const req = { headers: { authorization: "TokenSemBearer" } };
  const res = mockRes();

  auth(req, res, () => {});

  assert.equal(res.statusCode, 401);
});

test("rejeita esquema diferente de Bearer", () => {
  const req = { headers: { authorization: "Basic abc123" } };
  const res = mockRes();

  auth(req, res, () => {});

  assert.equal(res.statusCode, 401);
});

test("rejeita token inválido/expirado", () => {
  const req = { headers: { authorization: "Bearer token-invalido" } };
  const res = mockRes();

  auth(req, res, () => {});

  assert.equal(res.statusCode, 401);
});

test("aceita token válido e injeta userId", (t, done) => {
  const token = jwt.sign({ id: "user-123" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = mockRes();

  auth(req, res, () => {
    assert.equal(req.userId, "user-123");
    done();
  });
});
