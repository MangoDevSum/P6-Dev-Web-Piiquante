const Sauce = require("../models/sauce");
const fs = require("fs");

// Fonctions utilisées dans le fichier ../routes/sauce

// Création d'une sauce
async function createSauce(req, res, next) {
  console.log(req.body);
  if (('sauce' in req.body) == false) {
    res.status(400).json({
      error: "Missing 'sauce' entry!",
    });
    return;
  }
  const sauce_json = req.body.sauce; // JSON.parse(req.body.sauce);
  console.log(sauce_json);
  const sauce = new Sauce({
    ...sauce_json,
    _id: undefined,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  try {
    await sauce.save();
  } catch(erreur) {
    res.status(400).json({ error: erreur });
    return;
  }
  res.status(201).json({ message: "Sauce créée" });
}

// async function modifySauce(req, res, next) {
//   // Vérification créée par ce même utilisateur
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       if (!sauce) {
//         return res.status(404).json({
//           error: new Error("Objet non trouvé"),
//         });
//       }
//       if (sauce.userId !== req.auth.userId) {
//         return res.status(401).json({
//           error: new Error("Requête non autorisée"),
//         });
//       }
//       // Modification d'une sauce existante
//       Sauce.updateOne(
//         { _id: req.params.id },
//         { ...req.body, _id: req.params.id }
//       )
//         .then(() => res.status(200).json({ message: "Modified!" }))
//         .catch((err) => res.status(400).json({ err }));
//     })
//     .catch((error) => res.status(500).json({ error }));
// }

// async function deleteSauce(req, res, next) {
//   // Suppression d'une sauce existante crée par ce même utilisateur
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       if (!sauce) {
//         return res.status(404).json({
//           error: new Error("Objet non trouvé"),
//         });
//       }
//       if (sauce.userId !== req.auth.userId) {
//         return res.status(401).json({
//           error: new Error("Requête non autorisée"),
//         });
//       }
//       const filename = sauce.imageUrl.split("/images/")[1];
//       fs.unlink(`images/${filename}`, () => {
//         Sauce.deleteOne({ _id: req.params.id })
//           .then(() => res.status(200).json({ message: "Deleted!" }))
//           .catch((err) => res.status(400).json(err));
//       });
//     })
//     .catch((error) => res.status(500).json({ error }));
// }

async function getAllSauces(req, res, next) {
  // Renvoyer toutes les sauces pour les afficher sur la page d'accueil
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
}

// async function getOneSauce(req, res, next) {
//   // Renvoyer une sauce choisie au préalable sur l'accueil pour la page produit
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => res.status(200).json(sauce))
//     .catch((err) => res.status(404).json({ err }));
// }

module.exports = {
  ...module.exports,
  createSauce,
  // modifySauce,
  // deleteSauce,
  getAllSauces,
  // getOneSauce,
};
