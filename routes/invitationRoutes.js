const express = require('express');
const authController = require('../controller/authController');
const groupInvitation = require('../controller/invitationController');
// const authController = require('../controller/authController');
const router = express.Router();

router.post(
  '/send-invitation',
  authController.protect,
  groupInvitation.send_invitation
);
router.post(
  '/invite-status',
  authController.protectInvitation,
  groupInvitation.invite_accept_or_reject
);
// router.get(
//   '/check-invitation/:id',
//   // authController.protect,
//   authController.protectInvitation,
//   groupInvitation.checkInvitation
// );

module.exports = router;
