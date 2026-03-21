const prisma = require("../connect");
const bcrypt = require("bcrypt");
const SALT = 10;
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
      
      res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      if (err.code === 'P2002') {
        return res.status(400).json({ error: "Este email já está em uso." });
      }
      res.status(500).json({ error: "Erro interno ao criar usuário.", details: err.message });
    }
  }

  static async readUser(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar usuários", err: err.message });
    }
  }


  static async updateUser(req, res) {
    try {
      const { id, name, email, password } = req.body;
      
      const updateData = { name, email };
      if (password) {
        updateData.password = await bcrypt.hash(password, SALT);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });
      res.status(200).json({ message: "Usuário atualizado com sucesso!", user });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ error: "Erro interno ao atualizar usuário.", details: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.body;
      const user = await prisma.user.delete({
        where: { id },
      });
      res.status(200).json({ message: "Usuário deletado com sucesso!", user });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      res.status(500).json({ error: "Erro interno ao deletar usuário.", details: err.message });
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
      const token = jwt.sign({id: user.id}, process.env.JWT_SECRET || "", {expiresIn: "1d"});
      delete user.password;
      res.status(200).json({ message: "Login realizado com sucesso!", user, token });
    } catch (err) {
      console.error("Erro no login:", err);
      res.status(500).json({ error: "Erro interno ao fazer login.", details: err.message });
    }
  }
  static async getProfile(req, res) {
    try {
      const {authorization} = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "Token não fornecido" });
      }
      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
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