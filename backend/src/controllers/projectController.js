const prisma = require("../connect");
const puppeteer = require("puppeteer");
const { validateProjectInput } = require("../utils/projectValidation");

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

  let browserInstance = null;
  let browserLaunchPromise = null;

  async function closeBrowser() {
    if (browserInstance) {
      await browserInstance.close().catch(() => {});
      browserInstance = null;
      browserLaunchPromise = null;
    }
  }
  process.once("SIGINT", closeBrowser);
  process.once("SIGTERM", closeBrowser);

  // Limita quantas páginas do Chromium podem renderizar exportações ao
  // mesmo tempo, pra um pico de downloads simultâneos não estourar a memória.
  const MAX_CONCURRENT_EXPORTS = 3;
  let activeExports = 0;
  const exportQueue = [];

  function acquireExportSlot() {
    if (activeExports < MAX_CONCURRENT_EXPORTS) {
      activeExports++;
      return Promise.resolve();
    }
    return new Promise((resolve) => exportQueue.push(resolve));
  }

  function releaseExportSlot() {
    const next = exportQueue.shift();
    if (next) {
      next();
    } else {
      activeExports = Math.max(0, activeExports - 1);
    }
  }

  const MIN_DIMENSION = 100;
  const MAX_DIMENSION = 4096;


module.exports = class projectController {
  static async createProject(req, res) {
    const { title, content, mode } = req.body;
    const userId = req.userId;

    const validationError = validateProjectInput({ title, mode, content });
    if (validationError) {
      return res.status(400).json({ error: validationError });
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
        data: { title, userId, content: content || defaultContent, mode },
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
      if (project.userId !== req.userId)
        return res.status(403).json({ error: "Não autorizado" });
      return res.status(200).json(project);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar projeto", err: err.message });
    }
  }

  static async updateProject(req, res) {
    const { title, previewImage, mode, ...content } = req.body;
    const userId = req.userId;

    const validationError = validateProjectInput({ title, mode, content });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const existing = await prisma.project.findUnique({
        where: { id: req.params.id },
      });

      if (!existing || existing.userId !== userId) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      const project = await prisma.project.update({
        where: {
          id: req.params.id,
        },
        data: { title, userId, content, updatedAt: new Date(), previewImage, mode },
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
  const width = Number(req.body.width);
  const height = Number(req.body.height);

  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < MIN_DIMENSION ||
    height < MIN_DIMENSION ||
    width > MAX_DIMENSION ||
    height > MAX_DIMENSION
  ) {
    return res.status(400).json({
      error: `width e height devem ser inteiros entre ${MIN_DIMENSION} e ${MAX_DIMENSION}.`,
    });
  }

  async function getBrowser() {
    if (browserInstance) {
      try {
        await browserInstance.version();
        return browserInstance;
      } catch (err) {
        console.warn("Browser anterior fechado, criando novo...");
        browserInstance = null;
        browserLaunchPromise = null;
      }
    }

    // Evita disparar múltiplos launches simultâneos quando várias
    // exportações chegam ao mesmo tempo antes do browser existir.
    if (!browserLaunchPromise) {
      browserLaunchPromise = puppeteer
        .launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions",
            "--disable-background-networking",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--mute-audio",
            "--no-first-run",
          ],
        })
        .then((browser) => {
          browserInstance = browser;
          browser.once("disconnected", () => {
            browserInstance = null;
            browserLaunchPromise = null;
          });
          return browser;
        });
    }

    return browserLaunchPromise;
  }

  await acquireExportSlot();

  try {
    const browser = await getBrowser();

    page = await browser.newPage();

    // Bloqueia recursos que não afetam o print (analytics, fontes de terceiros
    // e trackers ficam esperando resposta e atrasavam o "networkidle0" antigo).
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (
        /vercel-insights\.com|vercel-analytics\.com|va\.vercel-scripts\.com|google-analytics\.com|googletagmanager\.com/.test(
          url
        )
      ) {
        return request.abort();
      }
      return request.continue();
    });

    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: 2,
    });

    page.setDefaultTimeout(30000);

    await page.evaluateOnNewDocument((data) => {
      window.INJECTED_EXPORT_DATA = data;
    }, req.body);

    const allowedFrontendUrls = [
      "https://performa-one.vercel.app",
      "http://localhost:5173",
    ];
    const frontendUrl = allowedFrontendUrls.includes(req.headers.origin)
      ? req.headers.origin
      : allowedFrontendUrls[0];

    const url = `${frontendUrl}/export-template`;

    // "domcontentloaded" + espera explícita pelas imagens/fontes do card é
    // bem mais rápido do que "networkidle0", que fica preso esperando
    // qualquer requisição em segundo plano (ex: telemetria) terminar.
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("#capture", { visible: true });

    await page.evaluate(async () => {
      const capture = document.querySelector("#capture");
      const images = Array.from(capture.querySelectorAll("img"));
      await Promise.all([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        ...images
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              })
          ),
      ]);
    });

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
    releaseExportSlot();
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
