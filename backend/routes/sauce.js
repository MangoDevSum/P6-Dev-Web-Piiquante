const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const check_auth = require("../middleware/auth");
const sauvegarder_image_envoyee = require("../middleware/multer");

router.get("/:id", check_auth, sauceCtrl.obtenirSauce);
router.get("/", check_auth, sauceCtrl.listerToutesLesSauces);
router.post("/", check_auth, sauvegarder_image_envoyee, sauceCtrl.creerSauce);
router.put("/:id", check_auth, sauvegarder_image_envoyee, sauceCtrl.majSauce);
router.delete("/:id", check_auth, sauceCtrl.supprimerSauce);
router.post("/:id/like", check_auth, sauceCtrl.likeOuPas);

module.exports = router;
