const checkAsync = (ync = require('../utils/checkAsync'));
const AppError = require('../utils/appError');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const sendPushNotification = require('../utils/sendPush');

// Create Group
exports.createGroup = checkAsync(async (req, res, next) => {
  if (!req.body.name) return next(new AppError('Group Must have a name!', 400));
  if (!req.body.coordinates)
    return next(new AppError('Coordinates are required!', 400));
  if (!req.body.address) return next(new AppError('Address missing!', 400));

  const groupExpire = req.body.groupExpires || 7;

  const group = await Group.create({
    photo: req.body.photo,
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    coordinates: req.body.coordinates,
    address: req.body.address,
    expireIN: new Date(Date.now() + groupExpire * 24 * 60 * 60 * 1000),
  });

  // Sending push notification
  // This below Api take userId and then send notification if user has FCM token
  // router.get('/send-fcm-noti/:id', authController.protect,userController.send_fcm_notifucation);

  //this code work best for those user if they have FCMtoken field. But if user does not have fcm token then the code send error and group will not create.
  try {
    const user = await User.findById(req.user._id);
    console.log('User >>>>>>> ', user);
    if (user?.fcmToken) {
      sendPushNotification(user.fcmToken);
    } else {
      console.log('User has no FCM token, skipping notification.');
    }
  } catch (err) {
    console.log('Failed to send push notification:', err.message);
  }

  res.status(200).json({
    status: 'Success',
    data: {
      group,
    },
  });
});

// UPDATEING GROUP
exports.updateGroup = checkAsync(async (req, res, next) => {
  const groupExpire = req.body.groupExpires || 7;
  const group = await Group.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      categories: req.body.categories,
      coordinates: req.body.coordinates,
      expireIN: new Date(Date.now() + groupExpire * 24 * 60 * 60 * 1000),
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'Group has successfully updated!',
    data: {
      group,
    },
  });
  console.log('Updating Group API Call');
});

// Get Group By ID
exports.getGroupById = checkAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group)
    return next(new AppError('Group belong with this id does not exist!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

//  GET ALL GROUPS
exports.getAllGroups = checkAsync(async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
});
