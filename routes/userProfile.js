const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const userProfileController = require('../controller/userProfileController');

const router = express.Router();

router.post(
  '/user_profile',
  authController.protect,
  userProfileController.uploadUserProfile,
  userProfileController.resizeUserPhoto,
  userProfileController.storeImageOnCloudnary,
  userProfileController.userProfile
);

module.exports = router;
