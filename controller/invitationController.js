const jwt = require('jsonwebtoken');
const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const InvitationModel = require('../models/groupInvitationModel');
const Group = require('../models/groupModel');

//  const invitation = await InvitationModel.create(req.body);
//   const group = await Group.findById(req.body.groupId);
//   // console.log('Group ', group);
//   if (!group) return next(new AppError('No Group found with this ID!', 404));
//   group.groupMembers.push(req.body.userId);
//   console.log('Group Members =>', group.groupMembers);
//   await group.save();

// 1) Pending   2) Accepting  3) Rejecting

const inviToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_IN,
  });

const createAndSendToken = (invitation, statusCode, res) => {
  const invitationToken = inviToken(invitation.id);
  console.log('Create and send Invitation Toiken =>', invitationToken);

  res.status(statusCode).json({
    status: 'success',
    invitationToken,
    invitation,
  });
};

// SEND INVITATION
exports.send_invitation = checkAsync(async (req, res, next) => {
  if (!req.body.groupId) return next(new AppError('Group ID is  required!'));
  if (!req.body.userId) return next(new AppError('User ID is  required!'));

  const invitation = await InvitationModel.create({
    groupId: req.body.groupId,
    userId: req.body.userId,
  });

  createAndSendToken(invitation, 201, res);
});

exports.invite_accept_or_reject = checkAsync(async (req, res, next) => {
  // console.log('Invitation ID: ',);
  console.log('INVITATION ====> ', req.invitation);

  if (req.body.status === 'accept') {
    const group = await Group.findById(req.invitation.groupId);
    group.groupMembers.push(req.invitation.userId);
    group.save();
    console.log('⭐⭐ Group ⭐⭐', group);
    const invitation = await InvitationModel.findByIdAndUpdate(
      req.invitation._id,
      {
        status: 'accept',
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: 'success',
      data: invitation,
    });
  }
});

exports.checkInvitation = checkAsync(async (req, res, next) => {
  console.log('Invitation ====>', req.invitation);
  // const invi = await InvitationModel.findOne({
  //   userId: req.params.id,
  // });
  // const filter = {
  //   userId: req.params.id,
  // };
  // const invita = await InvitationModel.find(filter);
  // console.log('Users All Invitation ', invita);
  // console.log('Invitation User ', invi);
  // console.log('Invitation ID:  ', invi.id);

  const invitation = await InvitationModel.findById(req.invitation.id)
    .populate('userId', 'firstName lastName email description')
    .populate('groupId', 'name coordinates description');

  res.status(200).json({
    ststus: 'success',
    data: {
      invitation,
    },
  });
});
