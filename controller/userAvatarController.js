const AppError = require('../utils/appError');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const multer = require('multer');
const sharp = require('sharp');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// UPLOADING USER PHOTO
exports.uploadUserProfile = upload.single('photo');

// CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_SECRET_KEY,
});

// STORE IMAGES ON CLOUDINARY

exports.storeImageOnCloudnary = async (req, res, next) => {
  console.log(req.user);
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'user_profile_image' },
    (err, result) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }
      // req.file.cloudinaryUrl = result;

      // res.status(200).json({
      //   staus: 'success',
      //   data: {
      //     result,
      //   },
      // });

      req.cloudinaryUrl = result;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};
