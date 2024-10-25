// Importer le model user
const User = require("../models/user");

// Importer bcrypt
const bcrypt = require("bcrypt");

// Importer Jsonwebtoken
const jwt = require("jsonwebtoken");

// Importer dotenv
const dotenv = require("dotenv");
const res = dotenv.config();

// Controller d'enregistrement
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res
            .status(400)
            .json({ message: "Erreur lors de la sauvegarde de l'utilisateur" })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Erreur lors du cryptage de mots de passe !" })
    );
};

// Controller de connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.PASSTOK, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) =>
          res.status(500).json({ message: "Utilisateur non trouvé !" })
        );
    })
    .catch((error) =>
      res.status(500).json({ message: "Impossible d'executer la fonciton" })
    );
};
