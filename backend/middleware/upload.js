// Gestion de fichiers uploadés
const fs = require("fs");
const multer = require("multer");

const EXTENSIONS = {
  "image/jpg": ".jpg",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

// Le middle-ware multer va se charger de stocker sur le disque / sauvegarder
// les fichiers uploadés par le client:
const sauvegarder_image_envoyee = multer({
  storage: multer.diskStorage({
    // Où? Dans le dossier `images/`.
    destination: async (req, file, return_) => {
      try {
        await fs.promises.mkdir("images/");
      } catch {}
      return_(null, "images/");
    },
    // Comment nommer le fichier à sauvegarder?
    filename: (req, file, return_) => {
      // On remplace les espaces par des underscores.
      let name = file.originalname.replaceAll(" ", "_");
      if ((file.mimetype in EXTENSIONS) == false) {
        return return_(new Error('type de fichier incorrect'), "");
      }
      const extension = EXTENSIONS[file.mimetype];
      // Puis on ajoute l'extension appropriée au nom initial, si besoin.
      if (name.toLowerCase().endsWith(extension) == false) {
        name += extension;
      }
      // Enfin, on rajoute qqch d'unique; comme la date pour éviter des collisions.
      return_(null, `${Date.now()}-${name}`);
    },
  }),
})
// un seul fichier uploadé à gérer: celui nommé `image`.
.single("image");

module.exports = sauvegarder_image_envoyee;
