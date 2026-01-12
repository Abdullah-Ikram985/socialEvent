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

  const inviteExpire = 5;

  const invitation = await Invitation.create({
    groupId: req.body.groupId,
    userId: req.body.userId,
    expiresIn: new Date(Date.now() + inviteExpire * 24 * 60 * 60 * 1000),
  });
  console.log('⭐Invitation ==> ', invitation);
  try {
    const user = await User.findById(req.body.userId);
    const group = await Group.findById(req.body.groupId);

    if (!user) console.log('User not found.');
    if (!group) console.log('Group not found.');

    await Group.findByIdAndUpdate(
      req.body.groupId,
      { $addToSet: { groupMembers: req.body.userId } },
      { new: true }
    );

    const updateUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        $set: { inviteStatus: invitation.inviteStatus },
      },
      { new: true }
    );

    // updateUser.save();
    console.log('👍👍👍👍 update user ', updateUser);

    // const updateUser = await User.findByIdAndUpdate(
    //   req.body.userId,
    //   {
    //     $push: { invitations: invitation },
    //   },
    //   { new: true }
    // );

    // group.save();
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
  if (!req.body.inviteStatus)
    return next(new AppError('Invitation Status required!', 401));

  const invitation = await Invitation.findById(req.params.id)
    .populate('userId', 'firstName lastName email description')
    .populate('groupId', 'name coordinates description');
  if (!invitation)
    return next(new AppError('Invitation belong this Id does not found!', 404));

  // console.log('INVITATION ==> ', invitation);
  // console.log('Body  ==> ', req.body.status);

  if (req.body.status === 'accepting') {
    // console.log(invitation);
    const group = await Group.findById(invitation.groupId);
    // console.log('Group ==>', group);
    group.groupMembers.push(invitation.userId);
    group.save();
    // console.log('⭐⭐ Group ⭐⭐', group);

    invitation.status = 'accepting';
    await invitation.save();

    return res.status(200).json({
      status: 'success',
      data: invitation,
    });
  }
  if (req.body.status === 'rejecting') {
    const invitation = await Invitation.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejecting',
      },
      { new: true }
    );
    await invitation.save();
    console.log('INVITATION REJECTING  ===>  ', invitation);
    return res.status(204).json({
      status: 'success',
      data: {
        invitation,
      },
    });
  }

  const invite = await Invitation.findByIdAndUpdate(
    req.params.id,
    {
      inviteStatus: req.body.inviteStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    invite,
  });
});

exports.get_invite_based_user_id = checkAsync(async (req, res, next) => {
  // console.log('Get Invitation Id ==>', req.params.id);

  const invitation = await Invitation.find({ userId: req.params.id });
  if (!invitation)
    return next(new AppError('Invitation belong this Id does not found!', 404));

  // console.log(invitation);
  res.status(200).json({
    status: 'success',
    data: {
      invitation,
    },
  });
});

// exports.checkInvitation = checkAsync(async (req, res, next) => {
//   console.log('Invitation ====>', req.invitation);
//   // const invi = await Invitation.findOne({
//   //   userId: req.params.id,
//   // });
//   // const filter = {
//   //   userId: req.params.id,
//   // };
//   // const invita = await Invitation.find(filter);
//   // console.log('Users All Invitation ', invita);
//   // console.log('Invitation User ', invi);
//   // console.log('Invitation ID:  ', invi.id);

//   const invitation = await Invitation
//     .findById(req.invitation.id)
//     .populate('userId', 'firstName lastName email description')
//     .populate('groupId', 'name coordinates description');

//   res.status(200).json({
//     ststus: 'success',
//     data: {
//       invitation,
//     },
//   });
// });
