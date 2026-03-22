const app = require("./index.js");
const PORT = process.env.PORT || 3001;
const cors = require("cors");

const allowedOrigins = ["https://performa-one.vercel.app", "http://localhost:5173"];

// Configuração do CORS com origens permitidas
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

app.use(cors(corsOptions));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));
