const AppError = require('../utils/appError');
const checkAsync = require('../utils/checkAsync');
const User = require('../models/userModel');
// const Profile = require('../models/avatarModel');
// const { userProfile } = require('./userAvatarController');

exports.createUser = checkAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  console.log('User', user);
  res.status(201).json({
    status: 'success',
    message: 'Successfully created',
    date: {
      user,
    },
  });

  next();
});

// UPDATING USER
exports.updateCurrentUser = checkAsync(async (req, res, next) => {
  if (!req.body.description) return next(new AppError('Must add description'));
  if (!req.body.image) return next(new AppError('Must add image'));

  if (typeof req.body.categories === 'string') {
    try {
      req.body.categories = JSON.parse(req.body.categories);
    } catch (err) {
      return next(new AppError(err.message, 404));
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      image: req.body.image,
      description: req.body.description,
      categories: req.body.categories,
    },
    {
      new: true,
    }
  );
  console.log('Updating User  ===>', updatedUser);

  res.status(200).json({
    status: 'success',
    message: 'Data successfully Update.',
    data: {
      updatedUser,
    },
  });
});

// GET USER BASED ON EMAIL
exports.getUserBasedOnEmail = checkAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      isSuccess: false,
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'user exist',
    isSuccess: true,
    user,
  });
});

// GET ALL USERS
exports.getAllUsers = checkAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    ststus: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
// GET CURRENT USER (BASED ON TOKEN)
exports.getUserBasedOnToken = checkAsync(async (req, res, next) => {
  const user = req.user;
  console.log('Current User ==> ', user);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// DELETE CURRENT USER (BASED ON TOKEN)
exports.deleteCurrentUser = checkAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('User Dos not exist.', 404));
  const delete_Current_User = await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: 'success',
    message: 'User successfully delete.',
    date: delete_Current_User,
  });
});
