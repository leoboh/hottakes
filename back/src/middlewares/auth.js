// Importer Jsonwebtoken
const jwt = require("jsonwebtoken");

// Importer dotenv
const dotenv = require("dotenv");
const res = dotenv.config();

// mdlw qui verifie si l'utilisateur est connecter
module.exports = (req, res, next) => {
  try {
    // recuperer le token
    const token = req.headers.authorization.split(" ")[1];

    // decoder le token
    const decodToken = jwt.verify(token, process.env.PASSTOK);

    // recuperer le userId qui se trouve dans le token
    const userId = decodToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ error: "erreur user ID" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      message: "Requète non authentifiée",
    });
  }
};
