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
  address: { type: String },
  groupMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },

  expireIN: {
    type: Date,
    validate: {
      validator: function (date) {
        return date > Date.now();
      },
      message: 'Expiration date must be in furture!',
    },
  },
  slug: String,
});

groupSchema.index({ expireIN: 1 }, { expireAfterSeconds: 0 });

groupSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
