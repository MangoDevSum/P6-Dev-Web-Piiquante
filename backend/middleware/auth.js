const jsonwebtoken = require("jsonwebtoken");

async function check_auth(req, res, next) {
  // Authentification par JWT
  if (req.headers.authorization.startsWith("Bearer ") == false) {
    res.status(401).json({
      error: "Header authentication mal formé",
    });
    return;
  }
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    req.auth = jsonwebtoken.verify(token, process.env.RANDOM_TOKEN_SECRET);
    if (req.body.userId && req.body.userId !== req.auth.userId) {
      throw "Invalid user ID";
    }
  } catch(_erreur) {
    console.error(_erreur);
    res.status(401).json({
      error: "Invalid request!",
    });
    return;
  }
  next();
};

module.exports = check_auth;
