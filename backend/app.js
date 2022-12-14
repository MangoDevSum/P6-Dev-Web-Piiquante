async function main() {
  // Fichier qui contient notre application Express
  // Mongoose à appeler

  const mongoose = require('mongoose');
  await mongoose.connect('mongodb://localhost:27017/test');

  const express = require('express');

  const userRoutes = require('./routes/user');

  const app = express();


  app.use(express.json());
  app.use('/api/auth', userRoutes);

  const PORT_BACKEND = 3000;
  console.log(`Listening at http://localhost:${PORT_BACKEND}/`);

  // FIXME: fournir cette valeur proprement quand on lance le serveur.
  process.env.RANDOM_TOKEN_SECRET ||= "mon mot de passe top secret"
  app.listen(PORT_BACKEND);

  module.exports = app;
}

main()
