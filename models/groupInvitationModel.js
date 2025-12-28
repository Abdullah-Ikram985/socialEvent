const mongoose = require('mongoose');

const groupInvitationSchema = new mongoose.Schema({
  groupName: {
    type: String,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepting', 'rejecting'],
  },
});

const InvitationModel = mongoose.model(
  'InvitationModel',
  groupInvitationSchema
);

module.exports = InvitationModel;
