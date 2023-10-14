/* eslint-disable no-await-in-loop */
const router = require('express').Router();
const arraySort = require('array-sort');
const NodeGeocoder = require('node-geocoder');
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// eslint-disable-next-line import/order
const ObjectId = require('mongodb').ObjectID;

// ** Models
const User = require('../model/User');
// const Subgroup = require('../model/Subgroups');

// ** utils
const { getDistanceBetween } = require('../utils/utils');
const { fetchStoreUserVendor } = require('../utils/storeFunctions');

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_API_KEY,
});

// ** List Groups
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const groupProject = {
    firstName: 1, lastName: 1, email: 1, role: 1, companyName: 1, address: 1, lastLogin: 1, emailVerified: 1,
  };

  let groupListFilter;
  if (res.user.role === 'admin') {
    groupListFilter = [{
      $match: {
        role: 'group',
      },
    },
    {
      $project: groupProject,
    },
    {
      $lookup: {
        from: 'subgroups',
        localField: '_id',
        foreignField: 'group',
        as: 'subgroups',
      },
    },
    {
      $sort: {
        companyName: 1,
      },
    },
    ];
  } else {
    groupListFilter = [
      {
        $match: { _id: res.user.role === 'store' ? await fetchStoreUserVendor(res.user._id) : ObjectId(res.user._id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'groups',
          foreignField: '_id',
          as: 'groups',
        },
      },
      {
        $project: { groups: 1 },
      },
      {
        $unwind: { path: '$groups' },
      },
      {
        $replaceRoot: { newRoot: '$groups' },
      },
      {
        $project: groupProject,
      },
      {
        $lookup: {
          from: 'subgroups',
          localField: '_id',
          foreignField: 'group',
          as: 'subgroups',
        },
      },
      {
        $sort: { companyName: 1 },
      },
    ];
  }

  const groupsAllData = await User.aggregate(
    [...groupListFilter],
  );
  return res.send({
    // totalCount,
    // filteredCount: orders.length,
    results: groupsAllData,
  });
});

// ** Get Group
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'group']), async (req, res) => {
  const groupId = req.params.id;
  const group = await User.aggregate(
    [
      { $match: { _id: ObjectId(groupId) } },
      { $project: { password: 0, parentVendor: 0, groups: 0 } },
      {
        $lookup: {
          from: 'users',
          let: { group_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $cond: {
                    if: { $isArray: '$groups' },
                    then: { $in: ['$$group_id', '$groups'] },
                    else: { $in: ['$$group_id', []] },
                  },
                },
              },
            },
            {
              $project: {
                email: 1, firstName: 1, lastName: 1, companyName: 1,
              },
            },
          ],
          as: 'vendors',
        },
      },
    ],
  );

  return res.send(group);
});

// Find Groups by School Name
router.get('/findBySchoolName/:schoolname', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(), async (req, res) => {
  const searchSchoolName = req.params.schoolname;
  if (searchSchoolName == 'empty-school-name') {
    return res.send({
      results: [],
    });
  }
  // First get all groups / schools
  const groups = await User.aggregate(
    [
      {
        $match: {
          role: 'group',
          companyName: new RegExp(`.*${searchSchoolName}.*`, 'i'),
        },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'address',
        },
      },
      {
        $lookup: {
          from: 'subgroups',
          localField: '_id',
          foreignField: 'group',
          pipeline: [
            {
              $match: {
                status: { $ne: 'deleted' },
              },
            },
          ],
          as: 'subgroups',
        },
      },
      {
        $project: {
          _id: 1.0,
          companyName: 1.0,
          firstName: 1.0,
          lastName: 1.0,
          email: 1.0,
          address: 1.0,
          subgroups: 1.0,
        },
      },
    ],
  );
  let schools = groups.map((group) => {
    if (!group.address[0]) { return null; }
    return ({ group });
  });
  schools = schools.filter((x) => x != null);
  return res.send({
    results: schools,
  });
});

// Find Groups by Postcode
router.get('/findByPostcode/:postcode', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(), async (req, res) => {
  const searchPostcode = req.params.postcode;
  const searchLocation = await geocoder.geocode(`${searchPostcode} Australia`);

  // First get all groups / schools
  const groups = await User.aggregate(
    [
      {
        $match: {
          role: 'group',
        },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'address',
        },
      },
      {
        $lookup: {
          from: 'subgroups',
          localField: '_id',
          foreignField: 'group',
          pipeline: [
            {
              $match: {
                status: { $ne: 'deleted' },
              },
            },
          ],
          as: 'subgroups',
        },
      },
      {
        $project: {
          _id: 1.0,
          companyName: 1.0,
          firstName: 1.0,
          lastName: 1.0,
          email: 1.0,
          address: 1.0,
          subgroups: 1.0,
        },
      },
    ],
  );
  // then loop to get distance
  let groupsWithDistance = groups.map((group) => {
    if (!group.address[0]) { return null; }
    const distance = getDistanceBetween(searchLocation[0].latitude, searchLocation[0].longitude, group.address[0].lat, group.address[0].lng);

    if (distance < 25) {
      return ({ distance, group });
    }
    return null;
  });

  groupsWithDistance = groupsWithDistance.filter((x) => x != null);

  // and finally sort by distance
  arraySort(groupsWithDistance, 'distance');

  return res.send({
    results: groupsWithDistance,
  });
});

// ** List Group Vendors
router.get('/vendors/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'group']), async (req, res) => {
  const vendors = await User.find({ groups: ObjectId(res.user._id) }).select('companyName email firstName lastName');
  return res.send({
    // totalCount,
    // filteredCount: orders.length,
    results: vendors,
  });
});

module.exports = router;
