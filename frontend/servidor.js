const aws = require("aws-sdk");
const express = require("express");

const app = express();
const porta = 3000;

const pasta = process.env.PWD === undefined ? process.cwd() : process.env.PWD;

// configuração da região na AWS
aws.config.update({ region: "us-east-1" });

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
        QueueUrl:
          "https://sqs.us-east-1.amazonaws.com/789254738812/SolicitarImagens",
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
