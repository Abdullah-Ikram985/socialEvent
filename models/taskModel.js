const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },
  },
  address: { type: String },
  taskList: {
    type: String,
  },
  categories: {
    type: Array,
  },
  taskMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  groupId: String,
});

const taskModel = new mongoose.model('taskModel', taskSchema);
module.exports = taskModel;
