const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const validator = require('validator');

const groupSchema = new mongoose.Schema({
  photo: String,
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  categories: {
    type: [String],
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    latDelta: {
      type: Number,
      required: true,
    },

    longDelta: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },

  expireIN: {
    type: Date,
    default: Date.now() + 10 + 60 / 1000,
    index: { expires: '1m' },
  },
  slug: String,
});
// groupSchema.createIndex({ createdAt: Date.now() }, { expireAfterSeconds: 10 });
groupSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
