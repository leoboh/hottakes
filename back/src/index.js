// Importation d'express
const express = require("express");
const app = express();

// Importation de mongoose
const mongoose = require("mongoose");

// Importation de bodyParser pour traduire les req.body en json
const bodyParser = require("body-parser");

// Importation du cors
const cors = require("cors");

// Importation de path
const path = require("path");

//Importer dotenv
require("dotenv").config();

// Importation des routes
const authRoutes = require("./routes/auth");
const sauceRoutes = require("./routes/sauce");

// Connexion à la bdd
mongoose
  .connect(process.env.PASSDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.disable("x-powered-by");

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);
app.use("/api/sauces", sauceRoutes);

app.listen(3000);
