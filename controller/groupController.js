const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');

const Group = require('../models/groupModel');

// Create Group
exports.createGroup = checkAsync(async (req, res, next) => {
  if (!req.body.name) return next(new AppError('Group Must have a name!', 400));
  if (!req.body.coordinates)
    return next(new AppError('Coordinates are required!', 400));

  const group = await Group.create({
    photo: req.body.photo,
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    coordinates: req.body.coordinates,
  });
  // group.createIndex({ createdAt: Date.now() }, { expireAfterSeconds: 10 });
  console.log('----------->', group);
  res.status(200).json({
    status: 'Success',
    data: {
      group,
    },
  });
});

// Get Group By ID
exports.getGroupById = checkAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new AppError('Group belong with this id does not exist!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

//  GET ALL GROUPS
exports.getAllGroups = checkAsync(async (req, res, next) => {
  const groups = await Group.find();
  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
});
