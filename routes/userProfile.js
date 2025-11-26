const mongoose = require('mongoose');
const express = require('express');
const authController = require('../controller/authController');
const userProfile = require('../controller/userProfile');

const router = express.Router();

router.post('/user_profile', authController.protect, userProfile.userProfile);

module.exports = router;
