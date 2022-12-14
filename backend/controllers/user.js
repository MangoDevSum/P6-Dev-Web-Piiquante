const bcrypt = require("bcrypt");

const User = require('../models/user.js');

async function signup(req, res, next) {
  console.log(req.body);
  if (!('password' in req.body)) {
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
      password: hash,
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

  // // Enregistrement d'un nouvel utilisateur dans la DB (création de compte)
  // bcrypt
  //   .hash(req.body.password, 10)
  //   .then((hash) => {
  //     const user = new User({
  //       ...req.body,
  //       password: hash,
  //     });
  //     user
  //       .save()
  //       .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
  //       .catch((error) => res.status(400).json({ error }));
  //   })
  //   .catch((error) => res.status(500).json({ error }));
  // res.send('Hello World!');
}

function login(req, res, next) {

}

module.exports = {
  signup,
  login,
};
