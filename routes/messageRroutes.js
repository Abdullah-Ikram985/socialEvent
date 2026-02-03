const express = require('express');

const authController = require('../controller/authController');
const messageController = require('../controller/chatController.js');
const validate = require('../utils/validate.js');
const sendMessageSchema = require('../validators/chatValidator.js');

const router = express.Router();

router.use(authController.protect);
router.route('/:groupId/messages').get(messageController.getGroupMessages); 
module.exports = router;
