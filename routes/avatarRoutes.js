const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const avatarControler = require('../controller/userAvatarController');

const router = express.Router();

router.post(
  '/userAvatar',
  authController.protect,
  avatarControler.uploadUserProfile,
  avatarControler.storeImageOnCloudnary
);

module.exports = router;
