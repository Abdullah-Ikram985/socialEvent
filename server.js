require('dotenv').config({ path: './config.env' });
const app = require('./app');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const {
  authenticateSocket,
  groupChatHandler,
} = require('./socket/groupChatHandler');

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
});

io.use(authenticateSocket);
groupChatHandler(io);

app.set('io', io);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful! 🎉'))
  .catch((err) => console.error('DB Connection Error ❌', err));

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
