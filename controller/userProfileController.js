const checkAsync = require('../utils/checkAsync');
const Profile = require('../models/userProfile');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const multer = require('multer');
const sharp = require('sharp');
const multerStorage = multer.memoryStorage();

// const multerStorage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserProfile = upload.single('photo');

exports.resizeUserPhoto = checkAsync(async (req, res, next) => {
  console.log('Request ', req.file);
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/userPhoto/${req.file.filename}`);
  next();
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_SECRET_KEY,
});

exports.storeImageOnCloudnary = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'user_profile_image' },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message,
        });
      }
      req.file.cloudinaryUrl = result;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

exports.userProfile = checkAsync(async (req, res, next) => {
  console.log('⭐⭐⭐', req.file);
  if (typeof req.body.categories === 'string') {
    try {
      req.body.categories = JSON.parse(req.body.categories);
    } catch (err) {
      return next(new AppError(err.message, 404));
    }
  }

  const userProfile = await Profile.create({
    photo: req.file.cloudinaryUrl.secure_url,
    description: req.body.description,
    categories: req.body.categories,
    // user: req.user.id, // optional back-reference
  });
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { userProfile: userProfile._id },
    { new: true }
  );
  res.status(200).json({
    status: 'Success',
    userProfile,
  });
});
