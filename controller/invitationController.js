const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const InvitationModel = require('../models/groupInvitationModel');
const Group = require('../models/groupModel');
// SEND INVITATION
exports.invitation = checkAsync(async (req, res, next) => {

  if (!req.body.groupId) return next(new AppError('Group ID is  required!'));
  if (!req.body.userId) return next(new AppError('User ID is  required!'));

  const invitation = await InvitationModel.create(req.body);

  const group = await Group.findById(req.body.groupId);
  // console.log('Group ', group);
  if (!group) return next(new AppError('No Group found with this ID!', 404));

  group.groupMembers.push(req.body.userId);
  console.log('Group Members =>', group.groupMembers);
  await group.save();
  res.status(200).json({
    status: 'success',
    data: {
      invitation,
    },
  });
});

exports.checkInvitation = checkAsync(async (req, res, next) => {
  const invi = await InvitationModel.findOne({
    userId: req.params.id,
  });
  const filter = {
    userId: req.params.id,
  };
  const invita = await InvitationModel.find(filter);
  console.log('Users All Invitation ', invita);
  console.log('Invitation User ', invi);
  // console.log('Invitation ID:  ', invi.id);
  const invitation = await InvitationModel.findById(invi.id)
    .populate('userId', 'firstName lastName email description')
    .populate('groupId', 'name coordinates description');

  res.status(200).json({
    ststus: 'success',
    data: {
      invitation,
    },
  });
});
