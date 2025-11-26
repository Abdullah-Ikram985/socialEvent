const express = require('express');
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.get('/logout', authController.protect, authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.post('/create', userController.createUser);
router.post('/checkEmail', userController.getUserBasedOnEmail);

router.get(
  '/getUser/:id',
  authController.protect,
  userController.getUserBasedOnID
);

module.exports = router;
