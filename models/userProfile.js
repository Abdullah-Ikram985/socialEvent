const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    photo: String,
    description: {
      type: String,
      require: [true, 'Must add description'],
    },
    categories: {
      type: [String],
      //   enum: [
      //     'Concerts & Music Shows',
      //     'Comedy Shows',
      //     'Theater & Performing Arts',
      //     'Festivals & Fairs',
      //     'Celebrity Meet',
      //   ],
      required: true,
    },

    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    // },
  }
  //   {
  //     toJSON: { virtuals: true },
  //     toObject: { virtuals: true },
  //   }
);
const Profile = mongoose.model('Profile', userProfileSchema);
module.exports = Profile;
