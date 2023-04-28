const express = require("express");
const app = express();
const porta = 3000;

const pasta = process.env.PWD === undefined ? process.cwd() : process.env.PWD;

app.use(express.static(pasta));
app.use(express.json());

app.post("/solicitar_imagens", (request, response) => {
  console.log(request.body);
  response.json({ body: request.body, ok: true });
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta}`);
});
