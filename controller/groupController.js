const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');

const Group = require('../models/groupModel');

exports.createGroup = checkAsync(async (req, res, next) => {
  console.log('Group Creation => ', req.body);
  const group = await Group.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      group,
    },
  });
});
