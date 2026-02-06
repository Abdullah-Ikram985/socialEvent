const express = require('express');
const authController = require('../controller/authController');
const inviteController = require('../controller/invitationController');

const router = express.Router();

// Sending invitation 
router.post(
  '/send_invitation',
  authController.protect,
  inviteController.send_invitation,
);
// updating status of invitation
router.post('/invite_status/:id', inviteController.invite_accept_or_reject);

// Get all invitation based on user Id
router.get(
  '/get_invitation_userid/:id',
  authController.protect,
  inviteController.get_invite_based_user_id,
);
// Get all invitation based on group Id
router.get(
  '/get_invitation_groupId/:groupId',
  authController.protect,
  inviteController.get_invite_based_group_id,
);

module.exports = router;
