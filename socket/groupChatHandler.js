const MessageModel = require('../models/messageModel');
const Group = require('../models/groupModel');
const jwt = require('jsonwebtoken');
const saveGroupMessage = require('../utils/mesageHelper');

const authenticateSocket = (socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization?.replace('Bearer ', '');

  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const groupChatHandler = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);

    socket.on('group:join', (groupID) => {
      socket.join(`group:${groupID}`);
    });

    socket.on('group:leave', (groupID) => {
      socket.leave(`group:${groupID}`);
    });

    socket.on('group:message:send', async ({ groupID, content }) => {
      try {
        const group = await Group.findById(groupID);
        if (!group) return socket.emit('error', { message: 'Group not found' });

        console.log("groupgroupgroupgroupgroup",socket.userId)



        const message = await saveGroupMessage({
          groupID,
          senderID: socket.userId,
          content,
        });

        io.to(`group:${groupID}`).emit('group:message:received', message);
      } catch (err) {
        console.error('Send message error:', err); // Add detailed log
        socket.emit('error', { message: 'Failed to send group message' });
      }
    });

    socket.on('group:message:read', async ({ groupID }) => {
      await MessageModel.updateMany(
        {
          group: groupID,
          sender: { $ne: socket.userId },
          readBy: { $ne: socket.userId },
        },
        { $addToSet: { readBy: socket.userId }, $set: { isRead: true } },
      );
      socket.to(`group:${groupID}`).emit('group:message:read:update', {
        groupID,
        userId: socket.userId,
      });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
    });
  });
};

module.exports = { authenticateSocket, groupChatHandler };
