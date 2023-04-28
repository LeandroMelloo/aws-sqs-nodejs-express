const aws = require("aws-sdk");
const express = require("express");

require("dotenv").config();

const app = express();
const porta = 3000;

const pasta = process.env.PWD === undefined ? process.cwd() : process.env.PWD;

// configuração da região na AWS
aws.config.update({ region: process.env.AWS_REGION });

// configuração do SQS
const sqs = new aws.SQS();

app.use(express.static(pasta));
app.use(express.json());

app.post("/solicitar_imagens", (request, response) => {
  const qtdImagens = parseInt(request.body.qtdImagens);

  for (let i = 0; i < qtdImagens; i++) {
    sqs.sendMessage(
      {
        MessageBody: "Imagem gerada SQS",
        QueueUrl: process.env.AWS_URL_SQS,
      },
      (erro, data) => {
        if (erro) {
          console.error(`Erro AWS SQS: ${erro}`);
        } else {
          console.log(`Sucesso: ${data.MessageId}`);
        }
      }
    );
  }

  response.json({ body: request.body, ok: true });
});

app.listen(porta, () => {
  console.log(`Servidor rodando na porta: ${porta}`);
});
