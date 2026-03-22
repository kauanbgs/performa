const prisma = require("../connect");
const puppeteer = require("puppeteer");

module.exports = class projectController {
  static async createProject(req, res) {
    const { title } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({
        error: "Todos os campos devem ser preenchidos"
      });
    }

    try {
      const project = await prisma.project.create({
        data: { title, userId }
      });
      return res.status(201).json({ message: "Projeto criado com sucesso!", id: project.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar projeto", err: err.message });
    }
  }

  static async readProject(req, res) {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id: req.params.id
        }
      });
      return res.status(200).json(project);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao buscar projeto", err: err.message });
    }
  }
  
  static async 

  static async exportProject(req, res) {
    let browser;

    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: 500,
        height: 700,
        deviceScaleFactor: 2,
      });

      const encodedData = encodeURIComponent(JSON.stringify(req.body));

      const url = `http://localhost:5173/export-template?data=${encodedData}`;

      await page.goto(url, { waitUntil: "networkidle0" });    

      await page.waitForSelector("#capture", { visible: true });

      const element = await page.$("#capture");

      const image = await element.screenshot({ type: "png" });

      res.set({
        "Content-Type": "image/png",
        "Content-Length": image.length,
      });

      res.send(image);
    } catch (error) {
  console.error("ERRO REAL:", error);
      return res.status(500).json({
        error: "Erro ao gerar imagem",
        details: error.message,
        stack: error.stack
      });
    } finally {
      if (browser) await browser.close();
    }
  }
}
