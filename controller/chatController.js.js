const MessageModel = require('../models/messageModel');
const checkAsync = require('../utils/checkAsync');
const { saveGroupMessage } = require('../utils/mesageHelper');
const Group = require('../models/groupModel');

exports.sendGroupMessage = checkAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const { content } = req.body;
  const group = await Group.findById(groupId);
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
  console.log(message);

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

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id; // Assuming you have auth middleware setting req.user (from JWT)
    console.log('just check call', groupId, userId);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Security: Ensure user is a member
    if (!group.groupMembers.includes(userId)) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this group' });
    }
    console.log('groupIdgroupIdgroupId', groupId, 'userId', userId);

    // Fetch messages, sorted by createdAt (assuming your schema has timestamps)
    const messages = await MessageModel.find({ group: groupId })
      .sort({ createdAt: 1 }) // Oldest first
      .populate('sender', 'firstName email image'); // Populate sender info
   console.log()
    console.log('➡️➡️➡️', messages);
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
