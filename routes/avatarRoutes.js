const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const userProfileController = require('../controller/userAvatarController');

const router = express.Router();

router.post(
  '/userAvatar',
  authController.protect,
  userProfileController.uploadUserProfile,
  userProfileController.storeImageOnCloudnary
);

module.exports = router;
