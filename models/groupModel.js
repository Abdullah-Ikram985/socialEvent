const mongoose = require('mongoose');
const validator = require('validator');

const groupSchema = new mongoose.Schema({
  photo: String,
  name: {
    type: String,
    // required: [true, 'Group must have a name!'],
  },
  description: {
    type: [String],
  },
  categories: {
    type: [String],
  },

  // location: {
  //   type: {
  //     type: String,
  //     default: 'Point',
  //     enum: ['Point'],
  //   },
    
  //   address: String,
  //   description: String,
  // },
  coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]',
      },
    },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
