const express = require('express');
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/create', userController.createUser);
router.get('/getAllUser', authController.protect, userController.getAllUsers);

module.exports = router;
