async function main() {
  // Fichier qui contient notre application Express
  // Mongoose à appeler

  const express = require('express');
  const mongoose = require('mongoose');
  const path = require("path");

  const sauceRoutes = require('./routes/sauce');
  const userRoutes = require('./routes/user');

  await mongoose.connect('mongodb://localhost:27017/test');

  const app = express();

  // Configurer le CORS pour autoriser toutes les requêtes
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    next();
  });

  app.use(express.json());
  // Authentification
  app.use('/api/auth', userRoutes);
  // Intéraction avec les sauces
  app.use("/api/sauces", sauceRoutes);
  // Accès aux images uploadées
  app.use("/images", express.static(path.join(__dirname, "images/")));

  const PORT_BACKEND = 3000;
  console.log(`Listening at http://localhost:${PORT_BACKEND}/`);

  // FIXME: fournir cette valeur proprement quand on lance le serveur.
  process.env.RANDOM_TOKEN_SECRET ||= "mon mot de passe top secret"
  app.listen(PORT_BACKEND);

  module.exports = app;
}

main()
