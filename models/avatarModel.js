const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  avatar: String,
});

const Profile = mongoose.model('Profile', userProfileSchema);

module.exports = Profile;
