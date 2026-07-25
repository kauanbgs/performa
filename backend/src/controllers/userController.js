const prisma = require("../connect");
const bcrypt = require("bcrypt");
const SALT = 8;
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = class userController {
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios!" });
      }

      const hashPassword = await bcrypt.hash(password, SALT);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      delete user.password;
      res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      if (err.code === 'P2002') {
        return res.status(400).json({ error: "Este email já está em uso." });
      }
      res.status(500).json({ error: "Erro interno ao criar usuário.", details: err.message });
    }
  }



  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({ error: "Email ou senha incorretos" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET não configurado");
        return res.status(500).json({ error: "Erro interno ao fazer login." });
      }
      const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1d"});
      delete user.password;
      res.status(200).json({ message: "Login realizado com sucesso!", user, token });
    } catch (err) {
      console.error("Erro no login:", err);
      res.status(500).json({ error: "Erro interno ao fazer login.", details: err.message });
    }
  }
  static async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      delete user.password;
      res.status(200).json({ message: "Perfil do usuário obtido com sucesso!", user });
    } catch (err) {
      console.error("Erro ao obter perfil do usuário:", err);
      res.status(500).json({ error: "Erro interno ao obter perfil do usuário.", details: err.message });
    }
  }
}