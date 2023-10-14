/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const TestModes = require('../model/TestModes');

module.exports = (testModeAllowed) => async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (!token) return res.status(403).send('Access denied. Please check your API token');
    try {
      const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
      res.user = verified;

      let user;
      user = await User.findOne({ _id: res.user._id }).select('role');
      if (user) {
        res.user.role = user.role;
        if ((testModeAllowed) && (!testModeAllowed.includes(user.role))) {
          return res.status(403).send('You do not have permission to run this request');
        } else {
          let testMode = await TestModes.find().limit(1);
          if (testMode.length > 0 && testMode[0].status == true) {
            return res.status(503).send('We are testing our service.');
          }
        }
      }
      next();
    } catch (err) {
      res.status(401).send('Invalid or expired auth token');
    }
  } else {
    return res.status(401).json('Malformed or unauthenticated auth token');
  }
};
