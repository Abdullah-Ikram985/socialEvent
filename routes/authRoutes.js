const express = require('express');
const { loginWithGoogle } = require('../controller/loginWithGoogle');
const { appleLogin } = require('../controller/loginWithApple');
const router = express.Router();

router.post('/google', loginWithGoogle);

router.post('/apple-login', appleLogin);

module.exports = router;
