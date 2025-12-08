const AppError = require('../utils/appError');
const checkAsync = require('../utils/checkAsync');
const User = require('../models/userModel');
const Profile = require('../models/avatarModel');
const { userProfile } = require('./userAvatarController');

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

exports.updateCurrentUser = checkAsync(async (req, res, next) => {
  // console.log('User ⭐', req.user);

  if (!req.body.description || !req.body.avatar)
    return next(new AppError('Must add description and avatar'));

  if (typeof req.body.categories === 'string') {
    try {
      req.body.categories = JSON.parse(req.body.categories);
    } catch (err) {
      return next(new AppError(err.message, 404));
    }
  }

  const profile = await Profile.create({
    avatar: req.body.avatar,
    description: req.body.description,
    categories: req.body.categories,
  });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    userProfile: profile._id,
  }).populate('userProfile');

  console.log('PROFILE  ', req.body);
  console.log('Updated User = == >', updatedUser);

  res.status(200).json({
    status: 'success',
    message: 'Data successfully Update.',
    data: {
      updatedUser,
    },
  });
});

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

exports.getUserBasedOnID = checkAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) next(new AppError('No user found with this ID.', 404));
  console.log('Get User ⭐', user);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Delete Current  User

exports.deleteCurrentUser = checkAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('User Dos not exist.', 404));

  const delete_Current_User = await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: 'success',
    message: 'User successfully delete.',
    date: delete_Current_User,
  });
});
