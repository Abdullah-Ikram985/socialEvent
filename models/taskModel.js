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
      _id: false,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isTaskDone: { type: Boolean, default: false },
    },
  ],

  groupId: String,
});

const taskModel = new mongoose.model('taskModel', taskSchema);
module.exports = taskModel;
