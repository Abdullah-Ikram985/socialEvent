const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
  },

  lastName: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
  },

  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  inviteStatus: String,

  password: {
    type: String,
    minlength: 8,
    select: false,
    required: function () {
      return this.provider === 'local';
    },
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  passwordChangeAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },

  passwordResetExpires: {
    type: Date,
    select: false,
  },
  image: String,
  description: String,
  categories: {
    type: [String],
  },

  fcmToken: {
    type: String,
  },
  invitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'inviteModel',
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmEmail = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  console.log('⭐', candidatePassword, userPassword);
  const result = await bcrypt.compare(candidatePassword, userPassword);
  console.log(result);
  return result;
};

userSchema.methods.changePasswordAfter = function (JwtIssuesTime) {
  if (this.passwordChangeAt) {
    const changePasswordTime = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    return JwtIssuesTime < changePasswordTime;
  }
  return false;
};

// PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {
  const userToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(userToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // TOKEN WILL BE EXPIRED AFTER 10 minutes

  return userToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
