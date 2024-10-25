// Importer Multer
const multer = require("multer");

// Extension pris en compte
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Choix de la destination des imports
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporter le module
module.exports = multer({ storage: storage }).single("image");
