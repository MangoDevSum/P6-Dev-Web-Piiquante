const Sauce = require("../models/sauce");
const fs = require("fs");

async function obtenirSauce(req, res, next) {
  const sauce = await trouverSauce(req, res, { dautrui: true });
  if (sauce == null) {
    return;
  }
  return res.status(200).json(sauce);
}

// Trouver la sauce demandée, si elle existe et a été créée par l'utilisateur.
async function trouverSauce(req, res, { dautrui }) {
  let sauce;
  try {
    sauce = await Sauce.findOne({
      _id: req.params.id,
    });
  } catch(erreur) {
    res.status(500).json({
      error: erreur,
    });
    return null;
  }
  if (sauce == null) {
    res.status(404).json({
      error: "Objet non trouvé",
    });
    return null;
  }
  if (dautrui == false && sauce.userId !== req.auth.userId) {
    res.status(401).json({
      error: "Requête non autorisée",
    });
    return null;
  }
  return sauce;
}

// Lister les sauces
async function listerToutesLesSauces(req, res, next) {
  let sauces;
  try {
    sauces = await Sauce.find({
      // On ne filtre pas par userId car on autorise certaines intéractions
      // avec les sauces d'autrui:
      //
      // userId: req.auth.userId,
    });
  } catch(erreur) {
    return res.status(400).json({ error });
  }
  return res.status(200).json(sauces);
}

// Création d'une nouvelle sauce
async function creerSauce(req, res, next) {
  // console.log(req.body);
  if (('sauce' in req.body) == false) {
    return res.status(400).json({
      error: "Donnée 'sauce' manquante!",
    });
  }
  const sauce_json = JSON.parse(req.body.sauce);
  // console.log(sauce_json);
  const sauce = new Sauce({
    ...sauce_json,
    _id: undefined, // on évite une injection de id pré-existant.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  try {
    await sauce.save();
  } catch(erreur) {
    return res.status(400).json({ error: erreur });
  }
  return res.status(201).json({
    message: "Sauce créée",
  });
}

// Modification d'une sauce existante
async function majSauce(req, res, next) {
  const sauce = await trouverSauce(req, res, { dautrui: false });
  if (sauce == null) {
    return;
  }
  const sauceId = req.params.id;
  try {
    await Sauce.updateOne({ _id: sauceId }, {
      ...req.body,
      _id: sauceId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
    });
  } catch(erreur) {
    return res.status(400).json({
      error: erreur,
    });
  }
  return res.status(200).json({
    message: "Modifié",
  });
}

// Suppression d'une sauce existante
async function supprimerSauce(req, res, next) {
  const sauce = await trouverSauce(req, res, { dautrui: false });
  if (sauce == null) {
    return;
  }
  try {
    const sauceId = req.params.id;
    await Sauce.deleteOne({ _id: sauceId });
  } catch(erreur) {
    return res.status(400).json({
      error: erreur,
    });
  }
  // On ne supprime l'image que quand la suppression de l'entrée dans la bdd a eu lieu.
  try {
    const filename = sauce.imageUrl.split("images/")[1];
    await fs.promises.unlink(`images/${filename}`);
  } catch(_erreur) {
    // La suppression du fichier ne devrait pas échouer; mais si jamais cela venait à arriver,
    // il s'agirait d'une erreur interne qu'il n'est pas nécessaire de montrer à l'utilisateur.
    console.error(_erreur);
  }
  return res.status(200).json({
    message: "Supprimé",
  });
}

async function likeOuPas(req, res, next) {
  const sauce = await trouverSauce(req, res, { dautrui: true });
  if (sauce == null) {
    return;
  }
  if (("like" in req.body) == false) {
    return res.status(400).json({
      error: "Donnée 'like' manquante!",
    });
  }
  const like = req.body.like;
  const userId = req.auth.userId;
  const sauceId = req.params.id;
  let message;
  try {
    switch (like) {
      // LIKE: 👍
      case 1: {
        await Sauce.updateOne({ _id: sauceId }, {
          $inc: {
            likes: +1,
          },
          $push: {
            usersLiked: userId,
          },
        });
        message = "Sauce likée";
      } break;

      // DISLIKE: 👎
      case -1: {
        await Sauce.updateOne({ _id: sauceId }, {
          $inc: {
            dislikes: +1,
          },
          $push: {
            usersDisliked: userId,
          },
        });
        message = "Sauce dislikée";
      } break;

      // UNLIKE
      case 0: {
        await Sauce.updateOne({ _id: sauceId }, {
          $inc: {
            // Si préalablement liké, on enlève un like;
            likes: (sauce.usersLiked.includes(userId) ? -1 : 0),
            // Si préalablement disliké, on enlève un dislike;
            dislikes: (sauce.usersDisliked.includes(userId) ? -1 : 0),
          },
          // On enlève le(s) markeur(s) de (dis)like préalable(s).
          $pull: {
            usersLiked: userId,
            usersDisliked: userId,
          },
        });
        message = "Sauce unlikée";
      } break;

      default: {
        return res.status(400).json({
          error: "Donnée 'like' incorrecte!",
        });
      }
    }
  } catch(erreur) {
    console.error(erreur);
    return res.status(500).json({
      error: erreur,
    });
  }
  return res.status(200).json({
    message,
  });
};

module.exports = {
  ...module.exports,
  creerSauce,
  majSauce,
  supprimerSauce,
  listerToutesLesSauces,
  obtenirSauce,
  likeOuPas,
};
