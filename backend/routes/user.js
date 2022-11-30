const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/api/auth/signup', userCtrl.signup);
// ('/api/auth/signup') ?
router.post('/api/auth/login', userCtrl.login);
// ('/api/auth/login') ?

module.exports = router;