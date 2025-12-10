const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');

const Group = require('../models/groupModel');

// Create Group
exports.createGroup = checkAsync(async (req, res, next) => {
  console.log('⭐ IMAGE ⭐', req.cloudinaryUrl.secure_url);
  console.log('⛔RAW COORDINATES:', typeof req.body.coordinates);

  if (
    typeof req.body.name === 'string' ||
    typeof req.body.coordinates === 'string' ||
    typeof req.body.categories === 'string'
  ) {
    req.body.name = JSON.parse(req.body.name);
    req.body.coordinates = JSON.parse(req.body.coordinates);
    req.body.categories = JSON.parse(req.body.categories);
  }

  if (!req.body.name || !req.body.coordinates)
    return next(new AppError('Group Must have a name and location!', 400));

  const group = await Group.create({
    photo: req.cloudinaryUrl.secure_url,
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    coordinates: req.body.coordinates,
  });
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
  // console.log(group);
  if (!group)
    return next(new AppError('Group belong with this id does not exist!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});


