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

exports.continueWithEmail = checkAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log('⭐');
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log('User', user);

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
  });
});

exports.getUser = checkAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
