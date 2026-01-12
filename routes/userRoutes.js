const express = require('express');
const userController = require('../controller/userController.js');
const authController = require('../controller/authController.js');
// const sendPushNotification = require('../utils/sendPush.js');
// const userAvatar = require('../controller/userAvatarController.js');
// const { auth } = require('google-auth-library');

const router = express.Router();

// router.post('/test-push', async (req, res) => {
//   //   const { userId } = req.body;

//   //   const user = await User.findById(userId);
//   //   if (!user?.fcmToken) {
//   // return res.status(400).json({ message: "User has no FCM token" });
//   //   }

//   await sendPushNotification(
//     'dWcBkDu5vk0yuAS86MHbe3:APA91bFyl76U0Mo_YY6lPTCjLag3qoTUbxwJ2uO8iwXErBLM5121KFxhTL0DzCwXJRa4wAKLkLxPdpXNXnj-7vgOMUeMpHBLAgx379kECNa6JN2iU55riYw'
//   );

//   res.json({ success: true });
// });

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.post(
  '/sendFcmToken',
  authController.protect,
  userController.set_fcm_token
);

router.get(
  '/send-fcm-noti/:id',
  authController.protect,
  userController.send_fcm_notifucation
);
// CREATE NEW USER
router.post('/create', userController.createUser);

// UPDATE CURRENT LOGIN USER (BASED ON TOKEN)
router.post(
  '/updateUser',
  authController.protect,
  userController.updateCurrentUser
);

router.post('/checkEmail', userController.getUserBasedOnEmail);
// GET USER BASED ON ID
router.get(
  '/getUserById/:id',
  authController.protect,
  userController.getUserByID
);
// GET ALL USERS
router.get('/allUsers', authController.protect, userController.getAllUsers);
// GET CURRENT LOGIN USER (BASED ON TOKEN)
router.get(
  '/getUser',
  authController.protect,
  userController.getUserBasedOnToken
);

// DELETE CURRENT LOGIN USER (BASED ON TOKEN)
router.delete(
  '/deleteUserAccount',
  authController.protect,
  userController.deleteCurrentUser
);
module.exports = router;
