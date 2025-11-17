const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const checkAsync = require('../utils/checkAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const siginToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = siginToken(user.id);

  /*
     TOKEN FOR COOKIES
  const cookiesOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
  res.cookie('jwt', token, cookiesOptions);
  user.password = undefined;
*/

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// ======= Signup =======
exports.signup = checkAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

// ======== Login =======

exports.login = checkAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select('+password');

  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Please enter correct password', 401));
  }

  createSendToken(user, 200, res);
});

// ======= Protect our Routes =======

exports.protect = checkAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  /* For cookies
    else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
    */
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  // VERIFICATION TOKEN
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_IN,
  });

  // CHECK IF USER STILL EXSIST
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppError('User belong this token does no longer exsist!', 401)
    );
  }

  //CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUSES

  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    );
  }
  // console.log('🍿', decode);
  req.user = currentUser;

  next();
});
