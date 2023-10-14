const router = require('express').Router();
const Settings = require('../model/Settings');

const verifyUser = require('../utils/verifyToken');

// Endpoint: get settings
router.get('/', verifyUser('admin'), async (req, res) => {
  const settings = await Settings.find();
  if (!settings) {
    return res.status(400).send('something went wrong');
  }
  return res.send(settings);
});

module.exports = router;
