const express = require('express');

const authController = require('../controller/authController');
const messageController = require('../controller/chatController.js');
const validate = require('../utils/validate.js');
const sendMessageSchema = require('../validators/chatValidator.js');

const router = express.Router();

router.use(authController.protect);
router
  .route('/:groupID/messages')
  .post(validate(sendMessageSchema), messageController.sendGroupMessage);

module.exports = router;
