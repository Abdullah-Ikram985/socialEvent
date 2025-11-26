const express = require('express');
const { loginWithGoogle } = require('../controller/loginWithGoogle');

const router = express.Router();

// no passport, no google-id-token strategy
router.post('/google', loginWithGoogle);

module.exports = router;
