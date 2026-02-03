const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const Invitation = require('../models/inviteModel');
const sendPushNotification = require('../utils/sendPush');

// Create Group
exports.createGroup = checkAsync(async (req, res, next) => {
  if (!req.body.name) return next(new AppError('Group Must have a name!', 400));
  if (!req.body.coordinates)
    return next(new AppError('Coordinates are required!', 400));
  if (!req.body.address) return next(new AppError('Address missing!', 400));

  const groupExpire = req.body.groupExpires || 7;

  const group = await Group.create({
    photo: req.body.photo,
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    coordinates: req.body.coordinates,
    address: req.body.address,
    createdBy: req.user._id,
    expireIN: new Date(Date.now() + groupExpire * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 'Success',
    message: 'Group has successfully created!',
    data: {
      group,
    },
  });
});

// UPDATEING GROUP
exports.updateGroup = checkAsync(async (req, res, next) => {
  const groupExpire = req.body.groupExpires || 7;
  const group = await Group.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      categories: req.body.categories,
      coordinates: req.body.coordinates,
      expireIN: new Date(Date.now() + groupExpire * 24 * 60 * 60 * 1000),
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    status: 'success',
    message: 'Group has successfully updated!',
    data: {
      group,
    },
  });
  console.log('Updating Group API Call');
});

// Get Group By ID
exports.getGroupById = checkAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id).populate({
    path: 'groupMembers',
    select: 'firstName lastName email  inviteStatus image',
  });

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

// GET ALL GROUPS IN WHICH USER INVITES OR JOIN GROUP
exports.get_all_groups_user_invite = checkAsync(async (req, res, next) => {
  console.log('User  ==>', req.user);
  const userId = req.user._id;
  console.log('🔥 User ID =>', userId);

  const user = await User.findById(userId);
  if (!user) return next(new AppError('User does not have any account!', 404));

  const groups = await Group.find({
    $or: [{ createdBy: userId }, { groupMembers: userId }],
  });
  console.log(groups);

  res.status(200).json({
    status: 'success',
    result: groups.length,
    data: {
      groups,
    },
  });
});
