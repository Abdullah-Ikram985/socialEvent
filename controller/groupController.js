const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const Invitation = require('../models/inviteModel');
const TaskModel = require('../models/taskModel');
const MessageModel = require('../models/messageModel');
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

// Delete All Invitation based on Group Id

// 1:- Delete all invitation based group id ✔️
// 2:- Update all user (in groupMembers array) ... remove inviteStatus field ✔️
// 3:- Delet  group  from document ✔️
// 4:- Delete all images of group
// 5:- Delete all task from mongo db based on group id ✔️
// 6:- Delete all messages based group id ✔️

exports.delete_group= checkAsync(async (req, res, next) => {
  const groupId = req.params.groupId;

  console.log('Group Id ===> ', groupId);
  // Finding group
  const group = await Group.findById(groupId);
  if (!group) {
    return next(new AppError('Group not found', 404));
  }
  console.log('⭐ Group  ==>', group);

  // Delete all invitation based group id
  const delete_invite = await Invitation.deleteMany({ groupId });
  console.log('Deleted Invitations ---', delete_invite.deletedCount);

  // Update all user (in groupMembers array) ... remove inviteStatus field ✔️
  await User.updateMany(
    { _id: { $in: group.groupMembers } },
    {
      $unset: { inviteStatus: '' },
    },
  );
  // Delet  group  from document ✔️
  await Group.findByIdAndDelete(group._id);

  //  Delete all task from mongo db based on group id ✔️
  const tasks_docs = await TaskModel.deleteMany({ groupId });
  console.log('Deleted Tasks ---', tasks_docs.deletedCount);

  // Delete all messages based group id
  const delete_messages = await MessageModel.deleteMany({
    group: groupId,
  });
  console.log('Deleted messages ---', tasks_docs.deletedCount);

  res.status(204).json({
    status: 'success',
    message: 'Successfully delete',
  });
});
