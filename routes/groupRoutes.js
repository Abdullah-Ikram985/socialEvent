const express = require('express');
const authController = require('../controller/authController');
const groupController = require('../controller/groupController');
const avatarControler = require('../controller/singleImgController');

const router = express.Router();

router.post(
  '/create_group',
  authController.protect,
  groupController.createGroup
);

router.patch('/update_group/:id', groupController.updateGroup);

router.get(
  '/get_group/:id',
  authController.protect,
  groupController.getGroupById
);

router.get('/all_groups', authController.protect, groupController.getAllGroups);
module.exports = router;
