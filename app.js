const express = require('express');
require('dotenv').config({ path: './config.env' });

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const userProfile = require('./routes/userProfile');

const app = express();
app.use(express.json());

// API ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', userProfile);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 400));
});
app.use(globalErrorHandler);
console.log('😂😂😂😂', process.env.NODE_ENV);

module.exports = app;


