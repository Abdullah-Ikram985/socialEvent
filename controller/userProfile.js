const checkAsync = require('../utils/checkAsync');
const Profile = require('../models/userProfile');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.userProfile = checkAsync(async (req, res, next) => {
  //   req.body.user = [req.user.id];
  const userProfile = await Profile.create({
    description: req.body.description,
    categories: req.body.categories,
    user: req.user.id, // optional back-reference
  });
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { userProfile: userProfile._id },
    { new: true }
  );
  res.status(200).json({
    status: 'Success',
    data: {
      userProfile,
    },
  });
});
