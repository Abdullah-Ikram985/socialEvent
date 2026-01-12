const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
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
  inviteStatus: {
    type: String,
    default: 'invited',

    enum: {
      values: ['invited', 'accepting', 'rejecting'],
      message: '{VALUE} is not a valid invite status!.',
    },
  },
  expiresIn: {
    type: Date,
  },
});

inviteSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });

const inviteModel = mongoose.model('inviteModel', inviteSchema);

module.exports = inviteModel;
