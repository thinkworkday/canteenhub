const router = require('express').Router();
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

const ObjectId = require('mongodb').ObjectID;

const {
  subgroupValidation,
} = require('../utils/validation');

// ** Models
const Subgroup = require('../model/Subgroups');
const Administrator = require('../model/Administrator');
const User = require('../model/User');

const NewYearSchoolStart = require('../model/NewYearSchoolStart');
const CheckNewYearLogin = require('../model/CheckNewYearLogin');

// const sendEmail = require('../utils/sendGrid/sendEmail');
// const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** Get Subgroups
router.get('/list/:parentGroup?', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group', 'vendor']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Group does not exist'); }

  // Get the parent group ID (if admin, then this must be provided)
  const parentGroup = (reqUser.role === 'admin' ? req.params.parentGroup : res.user._id);
  const statusFilter = { status: { $ne: 'deleted' } };
  // const roleFilter = { role: 'store' };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          // { lastName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      statusFilter,
      { group: ObjectId(parentGroup) },
    ],
  };

  const totalCount = await Subgroup.countDocuments({
    $and: [
      { group: ObjectId(parentGroup) },
      statusFilter,
    ],
  });
  // const totalCount = await Subgroup.countDocuments({ group: ObjectId(parentGroup) });
  const subgroups = await Subgroup.find(filterParams).select('-__v');
  return res.send({
    totalCount,
    filteredCount: subgroups.length,
    results: subgroups,
  });
});

// ** Get Subgroup
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Group does not exist'); }

  const subgroup = await Subgroup.findById(req.params.id).select('-__v');
  if (!subgroup) {
    return res.status(400).send('Subgroup not found or you do not have permission to view');
  }
  return res.send(subgroup);
});

// Create SubGroup
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group']), async (req, res) => {
  const subgroupData = req.body;

  // const groupId = (res.user.role === 'group' ? res.user._id : subgroupData.groupId);
  // subgroupData.group = groupId;

  // validate request
  const { error } = subgroupValidation(subgroupData);
  if (error) { return res.status(400).send(error.details[0].message); }

  const subgroup = new Subgroup(subgroupData);
  try {
    const savedRecord = await subgroup.save();
    return res.send({ subgroup: savedRecord, message: 'Subgroup created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Update SubGroup
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group']), async (req, res) => {
  const updateValues = req.body;

  // First check the user requesting (Only Vendors and Admin allowed)
  const reqUser = await User.findById(res.user._id).select('role');
  if (!reqUser) { return res.status(400).send('Group does not exist'); }

  // Get the parent group ID (if admin, then this must be provided)
  const parentGroup = (reqUser.role === 'admin' ? req.params.parentGroup : res.user._id);

  const savedSubgroup = await Subgroup.findOneAndUpdate({ _id: req.params.id, group: parentGroup }, updateValues, {
    new: true,
  });
  return res.send({ data: savedSubgroup, message: 'Subgroup successfully updated' });
});

// Update SubGroup For New Year School
router.put('/reset', verifyUser(['admin']), async (req, res) => {
  // First check the user requesting (Only Admin allowed)
  const reqUser = await Administrator.findById(res.user._id).select('role');
  
  if (!reqUser) { return res.status(400).send('Group does not exist'); }

  const updateSubgroup = await Subgroup.updateMany({ status: 'active' }, { $set: { status: "deleted" } }, {
    new: true,
  });
  await CheckNewYearLogin.updateMany({ status: 'active' }, { $set: { status: "deleted" } }, {
    new: true,
  });
  const newYearSchoolStart = await NewYearSchoolStart.find().limit(1);
  if (newYearSchoolStart.length > 0) {
    const updateSchoolStart = newYearSchoolStart[0];
    updateSchoolStart.date = new Date();
    await updateSchoolStart.save();
  } else {
    const newYear = new NewYearSchoolStart({
      date: new Date(),
    });
    await newYear.save();
  }
  return res.send({ data: updateSubgroup, message: 'Subgroup successfully updated' });
});

module.exports = router;
