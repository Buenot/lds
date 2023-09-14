const express = require("express");
const app = express();
const expbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path"); // Importe o módulo 'path'
// const Events = require("./models/Event");
const router = require("./routes/routes");
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

// Utilizando o arquivo router para gerenciar as rotas
app.use(router); 

// Servidor
app.listen(app.get("port"), function (req, res) {
  console.log(
    `Server is running at port http://${os.hostname}:${app.get("port")}`
  );
});
