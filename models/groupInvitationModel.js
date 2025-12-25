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
});



const InvitationModel = mongoose.model(
  'InvitationModel',
  groupInvitationSchema
);


module.exports = InvitationModel;
