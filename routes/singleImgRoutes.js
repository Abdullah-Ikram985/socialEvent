const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const avatarControler = require('../controller/singleImgController');

const router = express.Router();

router.post(
  '/singleImageUpload',
  authController.protect,
  avatarControler.singleImgUpload,
  avatarControler.storeImageOnCloudnary
);

module.exports = router;
