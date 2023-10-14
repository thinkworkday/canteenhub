/* eslint-disable no-nested-ternary */
const router = require('express').Router();

// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// ** Models
const Menu = require('../model/Menu');

const {
  menuValidation,
} = require('../utils/validation');

// ** utils
const { fetchStoreUserVendor } = require('../utils/storeFunctions');

// ** Create Menu
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const menuData = req.body;
  menuData.createdBy = res.user._id;
  menuData.createdByModel = (res.user.role === 'admin' ? 'Administrator' : 'User');

  // validate request
  const { error } = menuValidation(menuData);
  if (error) { return res.status(400).send(error.details[0].message); }

  const menu = new Menu(menuData);
  try {
    const savedMenu = await menu.save();
    return res.send({ menu: savedMenu, message: 'Menu successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** List Menus (All)
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)
  const vendorFilter = res.user.role === 'vendor' ? { vendors: { $in: ObjectId(res.user._id) } } : res.user.role === 'store' ? { vendors: await fetchStoreUserVendor(res.user._id) } : {};
  const statusFilter = { status: { $ne: 'deleted' } };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      vendorFilter,
      statusFilter,
    ],
  };

  const totalCount = await Menu.countDocuments({
    $and: [
      // vendorFilter,
      statusFilter,
    ],
  });

  const menus = await Menu.find(filterParams).populate({
    path: 'createdBy',
    select: {
      _id: 1, firstName: 1, lastName: 1, role: 1,
    },
  });

  return res.send({
    totalCount,
    filteredCount: menus.length,
    results: menus,
  });
});

// Get Menu
router.get('/:id/:raw?', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group', 'customer']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  let menu;
  if (req.params.raw && req.params.raw === 'true') {
    menu = await Menu.findOne({ _id: req.params.id })
      .populate({
        path: 'createdBy',
        select: {
          _id: 1, firstName: 1, lastName: 1, role: 1,
        },
      });
  } else {
    menu = await Menu.findOne({ _id: req.params.id })
      .populate({
        path: 'menuData',
        populate: {
          path: 'items',
          model: 'MenuItem',
          select: {
            __v: 0, createdBy: 0, createdByModel: 0,
          },
        },
      })
      .populate({
        path: 'createdBy',
        select: {
          _id: 1, firstName: 1, lastName: 1, role: 1,
        },
      });
  }

  if (!menu) {
    return res.status(400).send('Menu not found or you do not have permission to view');
  }

  if (menu.status === 'deleted') {
    return res.status(400).send('Menu was previously created however is now deleted');
  }
  return res.send(menu);
});

// Update Menus
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const updateValues = req.body;
  const savedMenu = await Menu.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ menu: savedMenu, message: 'Menu successfully updated' });
});

module.exports = router;
