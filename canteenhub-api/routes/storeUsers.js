/* eslint-disable no-nested-ternary */
const router = require('express').Router();
const bcrypt = require('bcrypt');

// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
const { canIAccessUser } = require('../utils/utils');

// ** Models
const Administrator = require('../model/Administrator');
const User = require('../model/User');
const Store = require('../model/Store');
// const Address = require('../model/Address');

// ** SendGrid
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

const { generateResetPasswordURL, generateRandomString } = require('../utils/utils');
const { fetchStoreUserVendor } = require('../utils/storeFunctions');

const {
  registerValidation,
} = require('../utils/validation');

const saltLength = 10;

// ** Create Store User
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  const userData = req.body;

  if (!userData.password) {
    userData.password = await generateRandomString();
  }

  // validate request
  const { error } = registerValidation(userData);
  if (error) { return res.status(400).send(error.details[0].message); }

  // check for unique user
  const emailExists = await User.findOne({ email: userData.email });
  if (emailExists) { return res.status(400).send('Email already exists'); }

  // check parent ID exists and is a Vendor
  const parentUser = await User.findOne({ _id: userData.parentVendor, role: 'vendor' });
  if (!parentUser) { return res.status(400).send('Vendor id provided is not found. Store users must be assigned to a parent vendor'); }

  // Hash the password
  const salt = await bcrypt.genSalt(saltLength);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashPassword,
    role: userData.role,
    ability: userData.ability,
    parentVendor: userData.parentVendor,
  });

  try {
    const savedUser = await user.save();
    // remove password
    delete savedUser._doc.password;

    // Gererate reset password link and email to admin
    const resetPasswordURL = await generateResetPasswordURL(savedUser._id);

    emailTemplates.storeUserCreated.dynamic_template_data.btn_url = resetPasswordURL;
    emailTemplates.storeUserCreated.dynamic_template_data.email_title = `Your Canteen Hub store user account has been created for ${parentUser.companyName}`;

    await sendEmail(
      [user.email],
      {
        ...emailTemplates.storeUserCreated,
      },
    );

    return res.send({ user: savedUser, message: 'Adminstrator successfully registered' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** Get Store Users
router.get('/list/:parentVendor?', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqAdministrator = await Administrator.findById(res.user._id).select('role');
  const reqUserInfo = await User.findById(res.user._id).select('role');
  const reqUser = reqAdministrator || reqUserInfo;
  if (!reqUser) { return res.status(400).send('Admin or Vendor does not exist'); }

  // Get the parent vendor ID (if admin, then this must be provided)
  const parentVendor = (reqUser.role === 'admin' ? req.params.parentVendor : res.user.role === 'store' ? await fetchStoreUserVendor(res.user._id) : res.user._id);

  const roleFilter = { role: 'store' };
  const vendorFilter = parentVendor ? { parentVendor: ObjectId(parentVendor) } : {};
  const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== '' ? { status: req.query.status } : {};
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        // { companyName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      vendorFilter,
      roleFilter,
      statusFilter,
    ],
  };

  const storeUsers = await User.aggregate(
    [
      {
        $match: filterParams,
      },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: 'storeUsers',
          as: 'stores',
        },
      },
    ],
  );

  const totalCount = await User.countDocuments({
    $and: [
      vendorFilter,
      roleFilter,
    ],
  });

  const users = await User.find(filterParams).select('-password -__v');
  return res.send({
    totalCount,
    filteredCount: users.length,
    results: storeUsers,
  });
});

// Get Store User
router.get('/user/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Vendor does not exist'); }

  let user;
  if (reqUser.role === 'admin') {
    user = await User.findOne({ _id: req.params.id }).select('-password -__v');
  } else {
    user = await User.findOne({ _id: req.params.id, parentVendor: ObjectId(res.user._id.toString()) }).select('-password -__v');
  }

  if (!user) {
    return res.status(400).send('User not found or you do not have permission to view');
  }
  return res.send(user);

  // const user = await User.findOne({ _id: req.params.id, vendorFilter }).select('-password -__v');
});

// Delete Store User
router.delete('/delete/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  // don't allow to delete self
  if (res.user._id === req.params.id) {
    return res.status(400).send('Cannot delete self');
  }

  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canIAccessUser(res.user._id, req.params.id);
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot delete this user');
  }

  // finally, check the store user is not attached to any stores
  const userAttachedStores = await Store.find({ storeUsers: { $in: [req.params.id] } });

  if (userAttachedStores.length > 0) {
    const attachStoreNames = userAttachedStores.map((store) => store.storeName).join(', ');

    // eslint-disable-next-line no-console
    console.log(attachStoreNames);
    return res.status(400).send(`User is assigned to the following stores (${attachStoreNames}). You need to first remove them from the store before deleting.`);
  }

  // delete user
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.send('user deleted');
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
