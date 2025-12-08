const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  avatar: String,
  description: {
    type: String,
  },
  categories: {
<<<<<<< HEAD:models/avatarModel.js
    type: [String],
=======
    type: [String]
>>>>>>> 21b129e7ecb69c414e45c16e84e05856a2a96aa2:models/userProfile.js
  },
});

const Profile = mongoose.model('Profile', userProfileSchema);

module.exports = Profile;
