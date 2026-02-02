const MessageModel = require('../models/messageModel');
const checkAsync = require('../utils/checkAsync');
const { saveGroupMessage } = require('../utils/mesageHelper');
const Group = require('../models/groupModel');

exports.sendGroupMessage = checkAsync(async (req, res, next) => {
  const { groupID } = req.params;
  const { content } = req.body;
  const group = await Group.findById(groupID);
  if (!group) {
    return res.status(404).json({
      success: false,
      error: 'Group not found',
    });
  }

  const message = await MessageModel.create({
    group: groupID,
    sender: req.user.id,
    content,
  });

  const populatedMessage = await MessageModel.findById(message._id).populate(
    'sender',
    'name email',
  );

  const messageIO = await saveGroupMessage({
    groupID,
    senderID: req.user.id,
    content,
  });

  // Emit via socket
  const io = req.app.get('io');
  io.to(`group:${groupID}`).emit('group:message:received', messageIO);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: populatedMessage,
  });
});
