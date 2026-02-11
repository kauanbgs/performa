const prisma = require("../connect");

module.exports = class projectController {
  static async createProject(req, res) {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Todos os campos devem ser preenchidos"
      });
    }

    try {
      await prisma.project.create({
        data: { title }
      });

      return res.status(201).json({ message: "Projeto criado com sucesso!", projeto: title });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar projeto", err: err.message });
    }
  }

  static async readProject(req, res) {
    try {
      const projects = await prisma.project.findMany();
      return res.status(200).json(projects);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar projetos", err: err.message });
    }
  }
};
