const prisma = require("../connect");
const puppeteer = require("puppeteer");

const defaultContent = {
  title: "Título",
  itemTitle: "nome da música",
  artist: "nome do artista",
  lyrics: "A letra vai aqui.",
  coverImage: "/transparente.jpg",
  bgImage: "/transparente.jpg",
  glassmorphism: true,
  glassColor: "#ffffff",
  posterImage: "/fundoLogin.png",
  profileImage: "/beatles.jpg",
  rating: 5,
  contentColor: "#000000",
  bgColor: "#ffffff",
};

module.exports = class projectController {
  static async createProject(req, res) {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({
        error: "Todos os campos devem ser preenchidos",
      });
    }

    try {
      const projectCount = await prisma.project.count({
        where: { userId },
      });

      if (projectCount >= 3) {
        return res.status(403).json({
          error:
            "Limite de projetos atingido. Você pode ter no máximo 3 projetos.",
        });
      }

      const project = await prisma.project.create({
        data: { title, userId, content: content || defaultContent },
      });
      return res
        .status(201)
        .json({ message: "Projeto criado com sucesso!", id: project.id });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erro ao criar projeto", err: err.message });
    }
  }

  static async readProjectsByUserId(req, res) {
    const userId = req.userId;

    try {
      const projects = await prisma.project.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return res.status(200).json(projects);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar projetos", err: err.message });
    }
  }

  static async readProject(req, res) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
      });
      if (!project)
        return res.status(404).json({ error: "Projeto não encontrado" });
      return res.status(200).json(project);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar projeto", err: err.message });
    }
  }

  static async updateProject(req, res) {
    const { title, previewImage, ...content } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({
        error: "Todos os campos devem ser preenchidos",
      });
    }

    const existing = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    try {
      const project = await prisma.project.update({
        where: {
          id: req.params.id,
        },
        data: { title, userId, content, updatedAt: new Date(), previewImage },
      });
      return res
        .status(200)
        .json({ message: "Projeto atualizado com sucesso!", id: project.id });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar projeto", err: err.message });
    }
  }

  static async exportProject(req, res) {
  let page;

  try {
    const browser = await getBrowser();

    page = await browser.newPage();

    await page.setViewport({
      width: 500,
      height: 700,
      deviceScaleFactor: 2,
    });

    page.setDefaultTimeout(15000);

    await page.evaluateOnNewDocument((data) => {
      window.INJECTED_EXPORT_DATA = data;
    }, req.body);

    const frontendUrl =
      req.headers.origin || "https://performa-one.vercel.app";

    const url = `${frontendUrl}/export-template`;

    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("#capture", { visible: true });

    const element = await page.$("#capture");

    if (!element) {
      throw new Error("Elemento #capture não encontrado");
    }

    const boundingBox = await element.boundingBox();

    if (!boundingBox) {
      throw new Error("Bounding box inválido");
    }

    const image = await page.screenshot({
      type: "png",
      clip: boundingBox,
    });

    res.set({
      "Content-Type": "image/png",
      "Content-Length": image.length,
    });

    return res.send(image);

  } catch (error) {
    console.error("ERRO REAL:", error);

    return res.status(500).json({
      error: "Erro ao gerar imagem",
      details: error.message,
    });

  } finally {
    if (page) await page.close();
  }
}

  static async deleteProject(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      if (project.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Não autorizado a deletar este projeto" });
      }

      await prisma.project.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Projeto deletado com sucesso!" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erro ao deletar projeto", err: err.message });
    }
  }
};
