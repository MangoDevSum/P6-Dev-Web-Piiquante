const Sauce = require("../models/Sauce");
const fs = require("fs");
const likeSauce = require("../middleware/like").likeSauce;
const unlikeSauce = require("../middleware/like").unlikeSauce;
const dislikeSauce = require("../middleware/like").dislikeSauce;

// Fonctions utilisées dans le fichier ../routes/sauce

exports.createSauce = (req, res, next) => {
  // Création d'une sauce
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then((sauce) => res.status(201).json({ message: "Sauce créée" }))
    .catch((err) => res.status(400).json({ err }));
};

exports.modifySauce = (req, res, next) => {
  // Vérification créée par ce même utilisateur
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error("Objet non trouvé"),
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error("Requête non autorisée"),
        });
      }
      // Modification d'une sauce existante
      Sauce.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Modified!" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // Suppression d'une sauce existante crée par ce même utilisateur
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error("Objet non trouvé"),
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error("Requête non autorisée"),
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Deleted!" }))
          .catch((err) => res.status(400).json(err));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // Renvoyer toutes les sauces pour les afficher sur la page d'accueil
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // Renvoyer une sauce choisie au préalable sur l'accueil pour la page produit
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(404).json({ err }));
};

exports.likeSauceSystem = (req, res, next) => {
  // Système de like, unlike, dislike
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch (like) {
    case 1:
      likeSauce(userId, sauceId, res);
      break;

    case 0:
      unlikeSauce(userId, sauceId, res);
      break;

    case -1:
      dislikeSauce(userId, sauceId, res);
      break;

    default:
      console.log(error);
  }
};
