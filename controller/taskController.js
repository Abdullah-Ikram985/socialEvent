const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const taskModel = require('../models/taskModel');

exports.createTask = checkAsync(async (req, res, next) => {
  console.log(req.body);

  const { name, location, taskList, categories, endTime, startTime, groupId } =
    req.body;

  if (!req.body.name) return next(new AppError('Task name is required!', 400));
  //   if (!req.body.timeAndDate)
  //     return next(new AppError('Task time and date is required!', 400));
  if (!req.body.taskList)
    return next(new AppError('Task list is required!', 400));

  const task = await taskModel.create({
    name: name,
    location: location,
    taskList: taskList,
    categories: categories,
    startTime: startTime,
    endTime: endTime,
    groupId: groupId,
  });
  console.log(task);
  res.status(200).json({
    status: 'success',
    data: { task },
  });
});
