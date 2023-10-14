const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

const {
  profileValidation,
} = require('../utils/validation');

// ** Models
const Profile = require('../model/Profiles');
const User = require('../model/User');

// const sendEmail = require('../utils/sendGrid/sendEmail');
// const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** Get Profiles
router.get('/list/:customer?', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group', 'customer']), async (req, res) => {
  // Get the customer ID (if admin, then this must be provided)
  const customerId = (res.user.role === 'admin' ? req.params.customer : res.user._id);
  const statusFilter = { status: { $ne: 'deleted' } };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      statusFilter,
      { customer: ObjectId(customerId) },
    ],
  };

  const totalCount = await Profile.countDocuments({
    $and: [
      { customer: ObjectId(customerId) },
      statusFilter,
    ],
  });

  const profiles = await Profile.find(filterParams)
    .populate({
      path: 'group',
      select: '_id companyName',
    }).populate({
      path: 'subgroups',
      populate: {
        path: 'group',
        select: '_id companyName',
      },
    }).select('-__v');

  // get upcoming events
  // const profileGroups = profiles.map((profile) => {
  //   const some = 'thin';
  //   // console.log(profile.subgroups);
  //   return profile.subgroups;
  // });
  // console.log(profileGroups);

  // const upcomingEvents = await Event.find({ group, status: { $in: ['active', 'fulfilled'] } });
  // return res.send({
  //   totalCount: upcomingEvents.length,
  //   filteredCount: upcomingEvents.length,
  //   results: upcomingEvents,
  // });

  return res.send({
    totalCount,
    filteredCount: profiles.length,
    results: profiles,
  });
});

// ** Get Profile
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group', 'customer']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Customer does not exist'); }

  const profile = await Profile.findById(req.params.id).populate({
    path: 'group',
    select: '_id companyName',
  }).populate({
    path: 'subgroups',
    populate: {
      path: 'group',
      select: '_id companyName',
    },
  }).select('-__v');
  if (!profile) {
    return res.status(400).send('Profile not found or you do not have permission to view');
  }
  return res.send(profile);
});

// Create Profile
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group', 'customer']), async (req, res) => {
  const profileData = req.body;

  const customerId = (res.user.role === 'customer' ? res.user._id : profileData.customerId);
  profileData.customer = customerId;
  // console.log('profileData', profileData);
  // validate request
  const { error } = profileValidation(profileData);
  // console.log(error);
  if (error) { return res.status(400).send(error.details[0].message); }

  const profile = new Profile(profileData);
  // console.log(error);
  try {
    const savedProfile = await profile.save();
    return res.send({ subgroup: savedProfile, message: 'Profile created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Update SubGroup
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group', 'customer']), async (req, res) => {
  const updateValues = req.body;

  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Customer does not exist'); }

  // Get the parent group ID (if admin, then this must be provided)
  const parentCustomer = (reqUser.role === 'admin' || reqUser.role === 'group' ? req.params.customer : res.user._id);

  const savedProfile = await Profile.findOneAndUpdate({ _id: req.params.id, customer: parentCustomer }, updateValues, {
    new: true,
  });
  return res.send({ data: savedProfile, message: 'Profile successfully updated' });
});

module.exports = router;
