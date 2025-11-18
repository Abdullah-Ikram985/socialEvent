const express = require('express');
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.post('/create', userController.createUser);
router.post('/checkEmail', userController.continueWithEmail);
router.get('/getUser/:id', userController.getUser);
module.exports = router;
