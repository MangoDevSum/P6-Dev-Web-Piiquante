const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const check_auth = require("../middleware/auth");
const sauvegarder_image_envoyee = require("../middleware/multer");

router.get("/", check_auth, sauceCtrl.getAllSauces);
router.post("/", check_auth, sauvegarder_image_envoyee, sauceCtrl.createSauce);
// router.post("/:id/like", check_auth, sauceCtrl.likeSauceSystem);
// router.put("/:id", check_auth, sauvegarder_image_envoyee, sauceCtrl.modifySauce);
// router.delete("/:id", check_auth, sauceCtrl.deleteSauce);
// router.get("/:id", check_auth, sauceCtrl.getOneSauce);

module.exports = router;
