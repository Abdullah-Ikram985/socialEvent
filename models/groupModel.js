const { default: mongoose } = require('mongoose');
const monngoose = require('mongoose');

const groupSchema = new monngoose.Schema({
  name: {
    type: String,
  },
  locations: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
