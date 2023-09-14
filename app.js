const express = require("express");
const app = express();
const expbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path"); // Importe o módulo 'path'
const Events = require("./models/Event");
const os = require("os");

// Configuração de host
const appPort = process.env.PORT || 8081;
app.set("port", appPort);

// Configuração para servir arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

var hbs = expbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/components/"),
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota princiapal
app.get("/", function (req, res) {
  Events.findAll().then(function (events) {
    res.render("home", { events: events });
  });
});

// Rota para o formulário
app.get("/form", function (req, res) {
  res.render("form");
});

// Rota para adicionar um evento
app.post("/add", function (req, res) {
  Events.create({
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace,
  })
    .then(function () {
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send("Preencha todos os campos corretamente");
    });
});

// Rota para remover um evento
app.get("/remove/:id", function (req, res) {
  Events.destroy({ where: { id: req.params.id } })
    .then(function () {
      res.send("Evento apagado com sucesso.");
    })
    .catch(function (erro) {
      res.send("Este evento não existe.");
    });
});

// Rota para atualizar um evento
app.get("/update/:id", function (req, res) {
  const eventId = req.params.id; // ID do evento que você deseja atualizar
  Events.findByPk(eventId).then(function (events) {
    res.render("update", { events: events });
  });
});

// Rota para processar a atualização de um evento
app.post("/update", function (req, res) {
  const eventId = req.body.eventId;
  const dataUp = {
    sport: req.body.sport,
    hostTeam: req.body.hostTeam,
    visitingTeam: req.body.visitingTeam,
    eventTime: req.body.eventTime,
    dateEvent: req.body.dateEvent,
    eventsPlace: req.body.eventsPlace,
  };

  Events.update(dataUp, {
    where: { id: eventId },
  })
    .then(function (result) {
      if (result[0] === 1) {
        res.send("Evento atualizado com sucesso.");
      } else {
        res.send("Evento não encontrado ou não atualizado.");
      }
    })
    .catch(function (error) {
      res.send("Ocorreu um erro ao atualizar o evento: " + error);
    });
});

// Servidor
app.listen(app.get("port"), function (req, res) {
  console.log(
    `Server is running at port http://${os.hostname}:${app.get("port")}`
  );
});
