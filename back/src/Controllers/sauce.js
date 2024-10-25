// Importer fs
const fs = require("fs");

// Importer de model des sauces
const Sauce = require("../models/sauce");

// Création d'une sauce
exports.createSauce = (req, res) => {
  let resSauce = JSON.parse(req.body.sauce);
  delete resSauce._id;
  delete resSauce._userId;
  const sauce = new Sauce({
    ...resSauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce créé !" }))
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Erreur lors de la sauvegarde de la sauce" })
    );
};

// Recuperer toutes les sauces en bdd
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ message: "Sauces introuvable" }));
};

// Recuperer une sauce en particulier
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ message: "Sauces introuvable" }));
};

// Modifier une sauce
exports.modifSauce = (req, res) => {
  const resSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete resSauce._userId;
  Sauce.findOne({ _id: req.params.id })
    .then(() => {
      Sauce.updateOne(
        { _id: req.params.id },
        { ...resSauce, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié!" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Supprimer une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`src/images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Objet supprimé !" });
        })
        .catch((error) => res.status(401).json({ error }));
    });
  });
};

// Like/dislike une sauce
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    switch (req.body.like) {
      case 1:
        /* ------------ */
        // Ajouter un like
        /* ------------ */
        if (
          !sauce.usersLiked.includes(req.body.userId) &&
          req.body.like === 1
        ) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
          )
            .then(() => {
              res.status(200).json({ message: "Objet liked !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
        break;

      case -1:
        /* --------------- */
        // Ajouter un dislike
        /* --------------- */
        if (
          !sauce.usersDisliked.includes(req.body.userId) &&
          req.body.like === -1
        ) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
          )
            .then(() => {
              res.status(200).json({ message: "Objet disliked !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
        break;

      case 0:
        /* ------------ */
        // Enlever un like
        /* ------------ */
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
          )
            .then(() => {
              res.status(200).json({ message: "Objet n'est plus liked !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
        /* --------------- */
        // Enlever un dislike
        /* --------------- */
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() => {
              res.status(200).json({ message: "Objet n'est plus disliked !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
        break;
      /* --------------- */
      // Si bad request
      /* --------------- */
      default:
        res.status(400).json({ error });
    }
  });
};
