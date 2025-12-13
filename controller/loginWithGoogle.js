const passport = require('passport');
const jwt = require('jsonwebtoken');

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
