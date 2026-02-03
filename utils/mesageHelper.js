const MessageModel = require('../models/messageModel');

const saveGroupMessage = async ({ groupID, senderID, content }) => {
  const message = await MessageModel.create({
    group: groupID,
    sender: senderID,
    content,
    readBy: [senderID], // sender has read
  });

  return await MessageModel.findById(message._id).populate(
    'sender',
    'firstName email image ',
  );
};

module.exports = saveGroupMessage;
