const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const allowedOrigins = ["https://performa-one.vercel.app", "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

class appcontroler {
  constructor() {
    this.express = express();
    // Necessário para o express-rate-limit (e req.ip em geral) identificar
    // o IP real do cliente quando a API roda atrás de um proxy (Render/Railway/etc).
    this.express.set("trust proxy", 1);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }
  middlewares() {
    this.express.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
    this.express.use(compression());
    this.express.use(express.json({ limit: "10mb" }));
    this.express.use(express.urlencoded({ limit: "10mb", extended: true }));
    this.express.use(cors(corsOptions));
  }
  routes() {
    // Fora do prefixo /performa e sem auth: é o que um uptime monitor
    // (ou o Render, que hiberna a instância em planos free) vai chamar.
    this.express.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", uptime: process.uptime() });
    });

    const apiRoutes = require("./routes/apiRoutes");
    this.express.use("/performa", apiRoutes);
  }
  exceptionHandler() {
    this.express.use((err, req, res, next) => {
      console.log(err);
      res
        .status(err.status || 500)
        .json({ message: err.message || "Erro interno de servidor!" });
    });
  }
}
module.exports = new appcontroler().express;
