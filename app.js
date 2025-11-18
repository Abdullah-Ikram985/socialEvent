const express = require('express');
require('dotenv').config({ path: './config.env' });

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

// Routes
const userRouter = require('./routes/userRoutes');
const app = express();
app.use(express.json());

// API ROUTES
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 400));
});

app.use(globalErrorHandler);
console.log('😂😂😂😂', process.env.NODE_ENV);

module.exports = app;
