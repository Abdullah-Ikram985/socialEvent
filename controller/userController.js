const AppError = require('../utils/appError');
const checkAsync = require('../utils/checkAsync');
const User = require('../models/userModel');

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
  // user.userProfile = profile._id;
  const user = await User.findById(req.params.id).populate({
    path: 'userProfile',
    select: 'description categories -_id', // only description and categories, exclude _id
  });
  if (!user) next(new AppError('No user found with this ID.', 404));
  console.log('Get User ⭐', user);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
