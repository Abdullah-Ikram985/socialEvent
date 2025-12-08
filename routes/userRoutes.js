const express = require('express');
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');
// const userAvatar = require('../controller/userAvatarController.js');
// const { auth } = require('google-auth-library');

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

router.post(
  '/updateUser',
  authController.protect,
  userController.updateCurrentUser
);
router.post('/checkEmail', userController.getUserBasedOnEmail);
router.get(
  '/getUser/:id',
  authController.protect,
  userController.getUserBasedOnID
);

router.delete(
  '/deleteUserAccount',
  authController.protect,
  userController.deleteCurrentUser
);
module.exports = router;
