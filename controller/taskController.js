const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const Task = require('../models/taskModel');
const Group = require('../models/groupModel');

exports.createTask = checkAsync(async (req, res, next) => {
  console.log(req.body);
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

  if (!req.body.name) return next(new AppError('Task name is required!', 400));
  //   if (!req.body.timeAndDate)
  //     return next(new AppError('Task time and date is required!', 400));
  if (!req.body.taskList)
    return next(new AppError('Task list is required!', 400));
  if (!req.body.groupId)
    return next(new AppError('Group Id is required!', 400));

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
  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

//  GET ALL TASKS BASED ON GROUP ID
exports.get_all_tasks_based_groupId = checkAsync(async (req, res, next) => {
  console.log(req.params.id);

  const tasks = await Task.find({ groupId: req.params.id }).populate({
    path: 'taskMembers',
    select:'firstName lastName email image'
  });

  console.log('⭐⭐⭐⭐', tasks);

  if (!tasks) return next(new AppError('No Tasks in Database', 404));

  res.status(200).json({
    status: 'success',
    result: tasks.length,
    data: {
      tasks,
    },
  });
});
