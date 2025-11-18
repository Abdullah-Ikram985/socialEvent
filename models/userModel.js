const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, 'Enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Enter your last name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your Email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  confirmEmail: {
    type: String,
    required: [true, 'Please confirm your email'],
    select: false,
    validate: {
      validator: function (el) {
        return el === this.email;
      },
      message: 'Emails are not same',
    },
  },
  password: {
    type: String,
    required: [true, 'please Enter your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        console.log(this.password, '👍', el);
        return el === this.password;
      },
      message: 'Passwords are not same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.confirmEmail = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

//
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
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
      10
    );
    return JwtIssuesTime < changePasswordTime;
  }
  return false;
};

// Password Reste Token
userSchema.methods.createPasswordResetToken = function () {
  const userToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(userToken)
    .digest('hex');
  // this.passwordResetExpires = Date.now() + (10 * 60) / 1000;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return userToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
