const jsonwebtoken = require("jsonwebtoken");

async function check_auth(req, res, next) {
  // Authentification par JWT
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    req.auth = jsonwebtoken.verify(token, process.env.RANDOM_TOKEN_SECRET);
    // console.log(req.auth);
    if (req.body.userId && req.body.userId !== req.auth.userId) {
      throw "";
    }
  } catch(_erreur) {
    return res.status(401).json({
      error: "Requête invalide!",
    });
  }
  next();
};

module.exports = check_auth;
