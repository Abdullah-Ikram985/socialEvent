const express = require('express');
const authController = require('../controller/authController');
const groupController = require('../controller/groupController');
const avatarControler = require('../controller/userAvatarController');

const router = express.Router();

router.post(
  '/create_group',
  authController.protect,
  avatarControler.uploadUserProfile,
  avatarControler.storeImageOnCloudnary,
  groupController.createGroup
);

router.get(
  '/get_group/:id',
  authController.protect,
  groupController.getGroupById
);

module.exports = router;
