const express = require('express');
const authController = require('../controller/authController');
const inviteController = require('../controller/invitationController');
// const authController = require('../controller/authController');
const router = express.Router();

router.post(
  '/send-invitation',
  authController.protect,
  inviteController.send_invitation
);
router.post('/invite-status/:id', inviteController.invite_accept_or_reject);

router.get(
  '/get-invitation-userid/:id',
  authController.protect,
  inviteController.get_invite_based_user_id
);


module.exports = router;
