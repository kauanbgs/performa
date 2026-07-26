const rateLimit = require("express-rate-limit");

// Login e criação de conta são os alvos naturais de brute-force/spam,
// por isso ficam mais restritos que o resto da API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

module.exports = { authLimiter };
