const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const groupController = require('../controller/groupController');
const router = express.Router();

router.post(
  '/create_group',
  authController.protect,
  groupController.createGroup
);

module.exports = router;
