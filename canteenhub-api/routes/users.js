/* eslint-disable no-case-declarations */
const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

const User = require('../model/User');
const TestMode = require('../model/TestModes');
const Administrator = require('../model/Administrator');
const NewYearSchoolStart = require('../model/NewYearSchoolStart');
const Profile = require('../model/Profiles');
const { canIAccessUser } = require('../utils/utils');

const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');
const Subgroup = require('../model/Subgroups');
const CheckNewYearLogin = require('../model/CheckNewYearLogin');

// Get Customers
router.get('/customers', verifyUser(['admin']), async (req, res) => {
  const totalCount = await User.countDocuments({});
  const filteredUser = await User.find({ role: 'customer' });

  const { currentPage, rowsPerPage } = req.query;
  const searchQuery = typeof req.query.q !== 'undefinded' ? req.query.q : '';
  const users = await User.aggregate(
    [
      { 
        $match: { 
          role: 'customer',
          $or: [
            { firstName: { $regex: searchQuery, $options: 'i'} },
            { lastName: { $regex: searchQuery, $options: 'i'} },
            { email: { $regex: searchQuery, $options: 'i'} },
            { companyName: { $regex: searchQuery, $options: 'i'} },
          ],
        } 
      },
      { $skip: (parseFloat(currentPage) - 1) * parseFloat(rowsPerPage) },
      { $limit: parseFloat(rowsPerPage) },
      {
        $lookup: {
          from: 'profiles',
          let: { customerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$customer', '$$customerId'] },
                    { $ne: ['$status', 'deleted'] },
                  ],
                },
              },
            },
            { $project: { password: 0 } },
          ],
          as: 'profiles',
        },
      },
      {
        $unwind: {
          path: '$profiles',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'profiles.subgroup': {
            $first: '$profiles.subgroups',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            groupId: '$profiles.group',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$groupId'] },
                  ],
                },
              },
            },
            {
              $project: {
                firstName: 1, lastName: 1, email: 1, companyName: 1,
              },
            },
          ],
          as: 'profiles.group',
        },
      },
      {
        $lookup: {
          from: 'subgroups',
          let: { subgroupId: '$profiles.subgroup' },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$_id', '$$subgroupId'] }] } } }],
          as: 'profiles.subgroup',
        },
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          role: { $first: '$role' },
          email: { $first: '$email' },
          profiles: { $push: '$profiles' },
        },
      },
    ],
  );
  return res.send({
    totalCount,
    filteredCount: filteredUser.length,
    results: users,
  });
});

// Get User(s) (Admin Only)
router.get('/:id?', verifyUser(['admin']), async (req, res) => {
  // if looking for a single user - find and return
  if (req.params.id) {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Malformed user id');
    }

    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(400).send('user not found');
    }
    return res.send(user);
  }

  const roleFilter = typeof req.query.role !== 'undefined' && req.query.role !== '' ? { role: req.query.role } : {};
  const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== '' ? { status: req.query.status } : {};
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { companyName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      roleFilter,
      statusFilter,
    ],
  };

  const totalCount = await User.countDocuments({});

  // console.log(req.);
  const users = await User.find(filterParams).select('-password -__v');
  return res.send({
    totalCount,
    filteredCount: users.length,
    results: users,
  });
});

// Check New Year User Login
router.put('/user/checkNewYearLogin', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['customer']), async (req, res) => {
  const userId = res.user._id;
  let newYear;
  const newYearSchoolStart = await NewYearSchoolStart.find().limit(1);
  if (newYearSchoolStart.length > 0) {
    newYear = newYearSchoolStart[0].date;
  } else {
    newYear = moment().startOf('year');
  }
  const newYearLogin = await CheckNewYearLogin.find({ customer: userId, status: { $ne: 'deleted' }, date: { $gte: newYear } }).sort({ date: -1 }).limit(1);
  if (newYearLogin.length == 0) {
    const checkNewYearLogin = new CheckNewYearLogin({
      customer: userId,
      status: 'active',
      date: new Date(),
    });
    try {
      await checkNewYearLogin.save();
      return res.send({ status: 'success'});
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  
  return res.send({ status: 'success'});
});

// Get My Profile
router.get('/user/me', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'group', 'store', 'school', 'customer']), async (req, res) => {
  let me;
  let testMode;
  me = await User.findById(res.user._id).populate('address').select('-password -__v');
  if (!me) { 
    me = await Administrator.findById(res.user._id).select('-password -__v');
    testMode = await TestMode.find().limit(1); 
  }
  let checkOldYear = false;
  let counterNewClass = 0;
  switch (me.role) {
    case 'admin':
      let testModeStatus;
      if (testMode[0].length == 0) {
        testModeStatus = false;
      } else {
        testModeStatus = testMode[0].status;
      }
      me._doc.testModeStatus = testModeStatus
      return res.send({ ...me._doc }); 
    case 'customer':
      const profiles = await Profile.find({ customer: me._id, status: { $ne: 'deleted' } }).populate({
        path: 'subgroups',
        populate: {
          path: 'group',
          select: '_id companyName',
        },
      });
      let newYear;
      const newYearSchoolStart = await NewYearSchoolStart.find().limit(1);
      if (newYearSchoolStart.length > 0) {
        newYear = newYearSchoolStart[0].date;
      } else {
        newYear = moment().startOf('year');
      }
      const newYearLogin = await CheckNewYearLogin.find({ customer: me._id, status: { $ne: 'deleted' }, date: { $gte: newYear } }).sort({ date: -1 }).limit(1);
      if (newYearLogin.length == 0) {
        await Promise.all(profiles.map(async (profile) => {
          let newClass = await Subgroup.find({ _id: profile.subgroups[0]._id, status: 'active', updatedAt: { $gt: newYear } });
          if (newClass.length > 0) {
            counterNewClass++;
          }
          // await Subgroup.findOneAndUpdate({ _id: profile.subgroups[0]._id, status: { $ne: 'deleted' }, updateAt: { $lt: newYear } }, { status: 'deleted' }, { new: true });
        }));
        if (counterNewClass >= profiles.length) {
          checkOldYear = false;
        } else {
          checkOldYear = true;
        }
      } else {
        checkOldYear = false;
      }
      
      
      return res.send({ ...me._doc, profiles, checkOldYear });
    default:
      return res.send(me);
  }
});

// Update User(s)
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'group', 'store', 'customer']), async (req, res) => {
  const updateValues = req.body;

  // first, check if user is me?
  if (res.user._id !== req.params.id) {
    // check if vendor can access user (via parentVendor)
    const vendorPermission = await canIAccessUser(res.user._id, req.params.id);
    if (!vendorPermission) {
      return res.status(400).send('permission error: access denied');
    }
  }
  const savedUser = await User.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ user: savedUser, message: 'User successfully updated' });
});

// Approve User(s)
router.patch('/approve/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin']), async (req, res) => {
  const approvedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'active' }, {
    new: true,
  });

  // send email
  await sendEmail(
    [approvedUser.email],
    {
      ...emailTemplates.userApproved,
    },
  );

  return res.send({ user: approvedUser, message: 'User successfully updated' });
});

// Decline User(s)
router.patch('/decline/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin']), async (req, res) => {
  // const declinedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'declined', ability: {} }, {
  const declinedUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'declined' }, {
    new: true,
  });

  // send verification email to new user
  await sendEmail(
    [declinedUser.email],
    {
      ...emailTemplates.userDeclined,
    },
  );

  return res.send({ user: declinedUser, message: 'User successfully updated' });
});

// Delete User(s)
router.delete('/delete/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  // don't allow to delete self
  if (res.user._id === req.params.id) {
    return res.status(400).send('Cannot delete self');
  }

  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canIAccessUser(res.user._id, req.params.id);
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot access');
  }

  // delete user
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.send('user deleted');
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

// Verify Email
// ** returns bool (true if user exists)
// ** params: email String, role String
router.get('/user/verifyEmail', async (req, res) => {
  const { email, role } = req.query;
  const userExists = await User.findOne({ email, role }).select('_id');
  return res.send(!!userExists);
});

module.exports = router;
