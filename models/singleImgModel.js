const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  image: String,
  description: String,
  categories: {
    type: [String],
  },
});

const SingleImgUpload = mongoose.model('SingleImgUpload', userProfileSchema);

module.exports = SingleImgUpload;
