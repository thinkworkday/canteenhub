const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const verifyUser = require('../utils/verifyToken');

const { generateRandomString } = require('../utils/utils');

const { registerValidation } = require('../utils/validation');

const Administrator = require('../model/Administrator');

const saltLength = 10;

// Create Administrator
router.post('/create', verifyUser(['admin']), async (req, res) => {
  const userData = req.body;

  if (!userData.password) {
    userData.password = await generateRandomString();
  }

  // validate request
  const { error } = registerValidation(userData);
  // console.log(userData, error);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check for unique user
  const emailExists = await Administrator.findOne({ email: userData.email });
  if (emailExists) {
    return res.status(400).send('Email already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(saltLength);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const administrator = new Administrator({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashPassword,
    role: userData.role,
    ability: userData.ability,
  });

  try {
    const savedUser = await administrator.save();
    // remove password
    delete savedUser._doc.password;

    const data = {
      recipientEmail: userData.email,
      subject: 'Your Canteen Hub administrator account has been created',
      content: 'Please ensure you contact the system administrator for your password',
      btnText: 'Login here',
      btnUrl: `${process.env.FRONTEND_URL}/admin/login`,
    };

    await axios.post(`${process.env.SERVER_URL}/api/notifications/sendNotification/`, data, {
      headers: {
        Authorization: req.headers.authorization,
      },
    }).catch((err) => {
      throw err;
    });

    return res.send({ user: savedUser, message: 'Adminstrator successfully registered' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Get Admin
router.get('/fetch/:id?', verifyUser(['admin']), async (req, res) => {
  // if looking for a single user - find and return
  if (req.params.id) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Malformed user id');
    }

    const administrator = await Administrator.findById(req.params.id).select('-password -__v');
    if (!administrator) {
      return res.status(400).send('administrator not found');
    }
    return res.send(administrator);
  }
  return res.status(400).send('Failed');
});

// ** List Administrators
router.get('/list/', verifyUser(['admin']), async (req, res) => {
  let administrators = await Administrator.find().populate();
  administrators = administrators.filter((obj) => obj.email !== 'joseph@papawheelie.com.au');
  return res.send({
    results: administrators,
  });
});

// Update Admin
router.patch('/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;

  // if password, the configure password
  if (updateValues.password) {
    // Hash the password
    const salt = await bcrypt.genSalt(saltLength);
    updateValues.password = await bcrypt.hash(updateValues.password, salt);
  }
  const savedAdmin = await Administrator.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ user: savedAdmin, message: 'Admin successfully updated' });
});

// ** Delete Administrators
router.delete('/delete/:id', verifyUser(['admin']), async (req, res) => {
  // don't allow to delete self
  if (res.user._id === req.params.id) {
    return res.status(400).send('Cannot delete self');
  }

  // delete user
  try {
    await Administrator.findByIdAndDelete(req.params.id);
    return res.send('Administrator deleted');
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
