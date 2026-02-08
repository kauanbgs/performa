const express = require("express");
const cors = require("cors");

class appcontroler {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(express.urlencoded({ extended: true }));
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