const app = require("./index.js");
const PORT = 5000;
const cors = require("cors");

// Configuração do CORS com origens permitidas
const corsOptions = {
  origin: "http://localhost:5173", //substituir no deploy
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));
