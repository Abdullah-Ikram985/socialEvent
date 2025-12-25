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
// CREATE NEW USER
router.post('/create', userController.createUser);
// UPDATE CURRENT LOGIN USER (BASED ON TOKEN)
router.post(
  '/updateUser',
  authController.protect,
  userController.updateCurrentUser
);

router.post('/checkEmail', userController.getUserBasedOnEmail);
// GET ALL USERS
router.get('/allUsers', authController.protect, userController.getAllUsers);
// GET CURRENT LOGIN USER (BASED ON TOKEN)
router.get(
  '/getUser',
  authController.protect,
  userController.getUserBasedOnToken
);

// DELETE CURRENT LOGIN USER (BASED ON TOKEN)
router.delete(
  '/deleteUserAccount',
  authController.protect,
  userController.deleteCurrentUser
);
module.exports = router;
