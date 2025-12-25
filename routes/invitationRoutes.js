const express = require('express');
const authController = require('../controller/authController');
const groupInvitation = require('../controller/invitationController');
const router = express.Router();

router.post(
  '/send-invitation',
  authController.protect,
  groupInvitation.invitation
);
router.get(
  '/check-invitation/:id',
  authController.protect,
  groupInvitation.checkInvitation
);

module.exports = router;
