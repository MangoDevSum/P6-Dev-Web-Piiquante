const bcrypt = require("bcrypt");

const User = require('../models/user.js');

const jsonwebtoken = require("jsonwebtoken");
// faire la manip pour le placer dans package.json ?

async function signup(req, res, next) {
  console.log(req.body);
  if (('password' in req.body) == false) {
    res.status(400).json({
      error: "Missing 'password' entry!",
    });
    return;
  }

  let hash;
  try {
    hash = await bcrypt.hash(req.body.password, 10);
  } catch(erreur) {
    console.error(erreur);
    res.status(500).json({
      error: erreur,
    });
    return;
  }

  try {
    const utilisateur_a_enregistrer = new User({
      ...req.body,
      password_hash: hash,
    });
    await utilisateur_a_enregistrer.save();
  } catch(erreur_rencontree) {
    console.error(erreur_rencontree);
    res.status(400).json({
      error: erreur_rencontree,
    });
    return;
  }
  res.status(201).json({ message: "Utilisateur créé !" })
}

async function login(req, res, next) {
  console.log(req.body);
  if (('password' in req.body) == false) {
    res.status(400).json({
      error: "Missing 'password' entry!",
    });
    return;
  }
  if (('email' in req.body) == false) {
    res.status(400).json({
      error: "Missing 'email' entry!",
    });
    return;
  }
  const { email, password } = req.body;

  let saved_user
  try {
    saved_user = await User.findOne({ email: email });
  } catch(erreur_bdd) {
    console.error(erreur_bdd);
    res.status(500).json({
      error: erreur_bdd,
    });
    return;
  }

  if (saved_user == null) {
    res.status(404).json({
      error: "Utilisateur inexistant",
    });
    return;
  }

  let valide;
  try {
    // valide = await bcrypt.hash(password, 10) === saved_user.password_hash;
    valide = await bcrypt.compare(password, saved_user.password_hash);
  } catch(erreur_bcrypt) {
    console.error(erreur_bcrypt);
    res.status(500).json({
      error: erreur_bcrypt,
    });
    return;
  }

  if (valide == false) {
    res.status(401).json({
      error: "Mot de passe incorrect",
    });
    return;
  }
  // Utilisateur s'est correctement authentifié, il a bien mérité son token :)
  const token_d_authentification = jsonwebtoken.sign(
    // On privilégie le id à l'email pour anticiper une éventuelle réutilisation
    // de l'email par un autre compte.
    {
      user_id: saved_user._id,
    },
    process.env.RANDOM_TOKEN_SECRET,
    {
      expiresIn: "24h",
    },
  );

  res.status(200).json({
    // Le nom des clés, ici, est fixé par la convention d'API avec le frontend.
    userId: saved_user._id,
    token: token_d_authentification,
  });
}



module.exports = {
  ...module.exports,
  signup,
  login,
};
