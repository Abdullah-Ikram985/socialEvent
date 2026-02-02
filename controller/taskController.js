const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const Task = require('../models/taskModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');

exports.createTask = checkAsync(async (req, res, next) => {
  // console.log(req.body);
  const {
    name,
    location,
    taskList,
    categories,
    endTime,
    startTime,
    address,
    groupId,
    taskMembers,
  } = req.body;

  if (!name) return next(new AppError('Task name is required!', 400));
  //   if (!req.body.timeAndDate)
  //     return next(new AppError('Task time and date is required!', 400));
  if (!taskList) return next(new AppError('Task list is required!', 400));
  if (!groupId) return next(new AppError('Group Id is required!', 400));
  if (!location) return next(new AppError('Location is required!', 400));

  const task = await Task.create({
    name: name,
    location: location,
    taskList: taskList,
    categories: categories,
    startTime: startTime,
    endTime: endTime,
    groupId: groupId,
    address: address,
    taskMembers: taskMembers,
  });

  console.log(task);
  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

//  GET ALL TASKS BASED ON GROUP ID
exports.get_all_tasks_based_groupId = checkAsync(async (req, res, next) => {
  console.log(req.params.id);

  const tasks = await Task.find({ groupId: req.params.id }).populate({
    path: 'taskMembers.user',
    select: 'firstName lastName email image isTaskDone',
  });

  console.log('⭐⭐⭐⭐', tasks);

  if (tasks.length === 0)
    return next(new AppError('No Tasks in Database', 404));

  res.status(200).json({
    status: 'success',
    result: tasks.length,
    data: {
      tasks,
    },
  });
});

// UPDATING Task BASED ON TASK ID

exports.updating_task_based_ID = checkAsync(async (req, res, next) => {
  const { name, location, taskList, categories, address, taskMembers } =
    req.body;
  console.log(req.params.id);
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      taskList: taskList,
      location: location,
      categories: categories,
      address: address,
      taskMembers: taskMembers,
    },
    {
      new: true,
    },
  );

  if (!task) return next(new AppError('There is no task belong this ID!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.task_completion = async (req, res, next) => {

  const task = await Task.findOneAndUpdate(
    { _id: req.params.taskId, 'taskMembers.user': req.params.memberId },
    { $set: { 'taskMembers.$.isTaskDone': true } },
    { new: true },
  );
  console.log('Task ===>', task);
  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'Task or member not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: task,
  });
};
