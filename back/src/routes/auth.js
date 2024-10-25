// Importer express
const express = require("express");

// Definir le router
const router = express.Router();

// Importation du controller d'authentification
const userCtrl = require("../Controllers/auth");

// Definir les route pour recuperer les doonees
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// Export des routes
module.exports = router;
