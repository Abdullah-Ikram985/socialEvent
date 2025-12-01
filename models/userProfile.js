const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  photo: String,
  description: {
    type: String,
    require: [true, 'Must add description'],
  },
  categories: {
    type: [String],
    required: true,
  },
});

const Profile = mongoose.model('Profile', userProfileSchema);

module.exports = Profile;
