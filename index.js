const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const porta = process.env.PORT || 8181;
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão bem sucedida!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((pergunta) => {
    console.log(pergunta);
    res.render("index", {
      pergunta: pergunta,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = (req.body.titulo || "").trim();
  var descricao = (req.body.descricao || "").trim();

  if(!titulo || !descricao){
    return res.redirect("/perguntar");
  }

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id }
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [['id','DESC']]
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = (req.body.corpo || "").trim();
  var perguntaId = (req.body.perguntas || "").trim();

  if(!corpo || !perguntaId){
    return res.redirect("/pergunta/"+perguntaId);
  }

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(porta, () => {
  console.log("App rodando na porta " + porta);
});
