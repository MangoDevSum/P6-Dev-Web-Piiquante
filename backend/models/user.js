const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Modèle d'un utilisateur qui sera stocké sur la DB

const user = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
});

user.plugin(uniqueValidator);
module.exports = mongoose.model("User", user);
