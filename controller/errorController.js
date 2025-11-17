const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  // Api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Render websites
  console.log('💥💥💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went worng',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // OPERATIONA ERROR, TRUSTED ERROR : SEND MESSAGE TO THE CLIENT
    if (err.isOperational) {
      console.log('💥💥💥', err);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // PROGRAMMING ERROR OR OTHER UNKNOWN ERROR: DO NOT LEAK ERROR DETAIL
    console.log('Error 💥', err);
    // SEND GENERIS MESSAGE
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  // B) FOR RENDER WEBSITES
  if (err.isOperational) {
    console.log('💥💥💥', err);
    return res.status(err.statusCode).render('error', {
      status: err.status,
      message: err.message,
    });
  }
  // PROGRAMMING ERROR OR OTHER UNKNOWN ERROR: DO NOT LEAK ERROR DETAIL
  console.log('Error 💥', err);
  return res.status(500).render('error', {
    status: err.status,
    message: 'Please try again later!',
  });
};

const handleCastErrorDB = (err) => {
  console.log('💥💥💥💥');
  const message = `Invalid ID ${err.value}`;
  return new AppError(message, 404);
};
const handleJWTExpiredError = (err) =>
  new AppError('Invalid Token please login again!', 401);
const JwtExpireErr = (err) =>
  new AppError('Your token expired Please login again!', 401);

module.exports = (err, req, res, next) => {
  console.log(err);
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // let error = { ...err };
    let error = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...err,
      message: err.message,
      name: err.name,
      stack: err.stack,
    };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleCastErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTExpiredError();
    if (error.name === 'TokenExpiredError') error = JwtExpireErr();
    sendErrorProd(error, req, res);
  }
};
