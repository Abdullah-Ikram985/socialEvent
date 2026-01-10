const passport = require('passport');
const jwt = require('jsonwebtoken');
const appleSignin = require('apple-signin-auth');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    // const photo = payload.picture;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        firstName,
        lastName,
        // photo,
        provider: 'google',
      });
    }
    console.log('⛔User Login with google ⛔', user);
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ success: true, user, token: appToken });
  } catch (err) {
    console.error('💥  ErrorUser Login with google 💥', err);
    res.status(401).json({ message: 'Invalid or expired Google token' });
  }
};

// LOGIN WITH APPLE

exports.siginWithApple = async (req, res, next) => {
  try {
    const { id_token } = req.body;
    console.log('Sign with Apple ID  : ', id_token);
    
    const appleUser = await appleSignin.verifyIdToken(id_token, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: true,
    });
    console.log('Apple User  ==> ', appleUser);

    /*
      appleUser contains:
      - sub (unique Apple user ID)
      - email (only first time)
      - email_verified
    */

    // 🔹 Find or create user in DB
    let user = await User.findOne({ appleId: appleUser.sub });

    if (!user) {
      user = await User.create({
        appleId: appleUser.sub,
        email: appleUser.email,
        provider: 'apple',
      });
    }

    // 🔹 Create your own JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRE_IN,
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Apple login failed' });
  }
};
