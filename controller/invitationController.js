const jwt = require('jsonwebtoken');
const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const Invitation = require('../models/inviteModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const sendPushNotification = require('../utils/sendPush');

// SEND INVITATION
exports.send_invitation = checkAsync(async (req, res, next) => {
  if (!req.body.groupId) return next(new AppError('Group ID is  required!'));
  if (!req.body.userId) return next(new AppError('User ID is  required!'));

  const group = await Group.findById(req.body.groupId);
  const group_created = group.createdBy;
  // console.log(group_created);

  if (group_created.toString() === req.user._id.toString())
    return next(new AppError('You can not invite itself!', 404));

  const finding = await Invitation.find({
    $and: [{ groupId: req.body.groupId }, { userId: req.body.userId }],
  });

  if (finding.length) return next(new AppError('User already invited!', 409));

  const inviteExpire = 5;

  const invitation = await Invitation.create({
    groupId: req.body.groupId,
    userId: req.body.userId,
    expiresIn: new Date(Date.now() + inviteExpire * 24 * 60 * 60 * 1000),
  });
  // console.log('⭐Invitation ==> ', invitation);
  try {
    const user = await User.findById(req.body.userId);
    const group = await Group.findById(req.body.groupId);

    if (!user) console.log('User not found.');
    if (!group) console.log('Group not found.');

    // await Group.findByIdAndUpdate(
    //   req.body.groupId,
    //   { $addToSet: { groupMembers: req.body.userId } },
    //   { new: true },
    // );

    const updateUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { inviteStatus: invitation.inviteStatus },
      },
      { new: true },
    );

    // console.log('👍👍👍👍 update user ', updateUser);

    if (user.fcmToken && group.name) {
      sendPushNotification(user.fcmToken, group.name, group.description);
    }
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({
    status: 'success',
    data: {
      invitation,
    },
  });
});

exports.invite_accept_or_reject = checkAsync(async (req, res, next) => {
  const { invitation_Id, inviteStatus } = req.body;

  if (!req.body.inviteStatus)
    return next(new AppError('Invitation Status required!', 401));

  // Find invitation
  const invitation = await Invitation.findById(invitation_Id)
    .populate('userId', 'firstName lastName email description')
    .populate('groupId', 'name coordinates description');

  if (!invitation) {
    return next(new AppError('Invitation not found!', 404));
  }

  //  ACCEPT INVITE
  if (inviteStatus === 'accepted') {
    const group = await Group.findById(invitation.groupId._id);

    // Prevent duplicate group members
    const alreadyMember = group.groupMembers.some(
      (user) => user.toString() === invitation.userId._id.toString(),
    );

    if (!alreadyMember) {
      group.groupMembers.push(invitation.userId._id);
      await group.save();
    }

    invitation.inviteStatus = 'accepted';
    await invitation.save();

  }

  // REJECT INVITE
  if (inviteStatus === 'rejected') {
    invitation.inviteStatus = 'rejected';
    await invitation.save();
  }

  // Update user (if really needed)
  await User.findByIdAndUpdate(invitation.userId._id, {
    inviteStatus: invitation.inviteStatus,
  });

  return res.status(200).json({
    status: 'success',
    data: invitation,
  });
});

// CHECK INVITATION BASED ON USER ID
exports.get_invite_based_user_id = checkAsync(async (req, res, next) => {
  // console.log('Get Invitation Id ==>', req.params.id);

  const invitation = await Invitation.find({ userId: req.params.id });
  if (!invitation)
    return next(new AppError('Invitation belong this Id does not found!', 404));

  // console.log(invitation);
  res.status(200).json({
    status: 'success',
    result: invitation.length,
    data: {
      invitation,
    },
  });
});

// CHECK INVITATION BASED ON GROUP ID
exports.get_invite_based_group_id = checkAsync(async (req, res, next) => {
  console.log(req.params.groupId);

  const invitation = await Invitation.findOne({ groupId: req.params.groupId });
  console.log(invitation);
  if (!invitation)
    return next(
      new AppError('Invitation belong this group id does not found!', 404),
    );

  res.status(200).json({
    status: 'success',
    // result: invitation,
    data: {
      invitation,
    },
  });
});

