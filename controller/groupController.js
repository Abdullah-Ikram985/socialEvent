const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');

const Group = require('../models/groupModel');

exports.createGroup = checkAsync(async (req, res, next) => {
  console.log('Group Creation => ', req.file);
  const group = await Group.create(req.file);

  res.status(200).json({
    status: 'Success',
    date: {
      group,
    },
  });

  next();
});
