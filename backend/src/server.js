const app = require("./index");
const PORT = 5000;
const cors = require('cors');

// Configuração do CORS com origens permitidas
const corsOptions = {
  origin: '*', //substituir no deploy
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}.`));