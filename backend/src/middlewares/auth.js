const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET não configurado");
        return res.status(500).json({ error: "Erro interno de servidor!" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({ error: "Erro de token" });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Token mal formatado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
        req.userId = decoded.id;
        return next();
    });
};