// Importer express
const express = require("express");

// Definir le router
const router = express.Router();

// Importation du controller de sauce
const sauceCtrl = require("../Controllers/sauce");

// Importation des middlewares
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");

// Definir les routes pour manipuler les sauces
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// Export des routes
module.exports = router;
