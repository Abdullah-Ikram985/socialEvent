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
  taskList: {
    type: String,
  },
  categories: {
    type: Array,
  },
  groupId: String,
});

const taskModel = new mongoose.model('taskModel', taskSchema);
module.exports = taskModel;
