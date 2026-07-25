const express = require("express");
const cors = require("cors");

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
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }
  middlewares() {
    this.express.use(express.json({ limit: "10mb" }));
    this.express.use(express.urlencoded({ limit: "10mb", extended: true }));
    this.express.use(cors(corsOptions));
  }
  routes() {
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
