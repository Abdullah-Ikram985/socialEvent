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

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};
