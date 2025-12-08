const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  avatar: String,
  description: {
    type: String,
  },
  categories: {
    type: [String],
  },
});

const Profile = mongoose.model('Profile', userProfileSchema);

module.exports = Profile;
