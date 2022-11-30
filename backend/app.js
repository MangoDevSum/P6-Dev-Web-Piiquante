// Fichier qui contient notre application Express

const express = require('express');

const userRoutes = require('./routes/user');

const app = express();

// app.use((req, res) = > {
//   res.json({ message: 'Votre requete a bien ete reçue'});
// });

app.use('/api/auth', userRoutes);

module.exports = app;