// Gestion de fichiers uploadés
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Le middle-ware multer va se charger de stocker sur le disque / sauvegarder
// les fichiers uploadés par le client:
const sauvegarder_uploads = multer({
  storage: multer.diskStorage({
    // Où? Dans le dossier `images`.
    destination: (req, file, return_) => {
      return_(null, "images");
    },
    // Comment nommer le fichier à sauvegarder?
    filename: (req, file, return_) => {
      // On remplace les espaces par des underscores;
      const name = file.originalname.replaceAll(" ", "_");
      const ext = MIME_TYPES[file.mimetype];
      // puis on ajoute l'extension appropriée au nom initial;
      // avec la date pour éviter des collisions
      return_(null, `${Date.now()}-${name}.${ext}`);
    },
  }),
})
// un seul fichier uploadé à gérer: celui nommé `image`.
.single("image");

module.exports = sauvegarder_uploads;
