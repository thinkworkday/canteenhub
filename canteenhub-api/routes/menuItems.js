const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
const { canIAccessRecord } = require('../utils/utils');

// ** Models
const Menu = require('../model/Menu');
const MenuItem = require('../model/MenuItem');

const {
  menuItemValidation,
} = require('../utils/validation');

// ** List Menu Items
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const statusFilter = { status: { $ne: 'deleted' } };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
  const filterParams = {
    $and: [
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      // vendorFilter,
      statusFilter,
    ],
  };

  const totalCount = await MenuItem.countDocuments({
    $and: [
      // vendorFilter,
      statusFilter,
    ],
  });

  const menus = await MenuItem.find(filterParams).populate([
    {
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
  ]);

  return res.send({
    totalCount,
    filteredCount: menus.length,
    results: menus,
  });
});

// ** List Menu Items
router.get('/listByMenu/:parentMenuId', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const { parentMenuId } = req.params;
  const statusFilter = { status: { $ne: 'deleted' } };
  const parentMenu = await Menu.findById(parentMenuId).populate([
    {
      path: 'menuData.items',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
  ]);

  let menuItemIds = parentMenu.menuData.map((menuItem) => menuItem.items).flat();
  menuItemIds = [...new Set(menuItemIds)];

  const menuItems = await MenuItem.find(
    {
      $and: [
        { _id: { $in: menuItemIds } },
        statusFilter,
      ],
    },
  ).populate([
    {
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
  ]).sort({ name: 1 });

  return res.send({
    // totalCount,
    // filteredCount: menus.length,
    results: menuItems,
  });
});

// ** Create Menu Item
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const menuItemData = req.body;
  menuItemData.createdBy = res.user._id;
  menuItemData.createdByModel = (res.user.role === 'admin' ? 'Administrator' : 'User');

  // validate request
  const { error } = menuItemValidation(menuItemData);
  if (error) { return res.status(400).send(error.details[0].message); }

  // console.log(menuItemData);

  const menuItem = new MenuItem(menuItemData);
  try {
    const savedMenuItem = await menuItem.save();
    return res.send({ menuItem: savedMenuItem, message: 'Menu item successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Get Menu Item
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'customer']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const menuItem = await MenuItem.findOne({ _id: req.params.id }).populate([
    {
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
    {
      path: 'options',
    },
  ]);

  if (!menuItem) { return res.status(400).send('Menu item not found or you do not have permission to view'); }
  if (menuItem.status === 'deleted') { return res.status(400).send('Menu Item was previously created however is now deleted'); }
  return res.send(menuItem);
});

// Get Menu Item Tags
router.get('/tags/list', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'store', 'vendor']), async (req, res) => {
  const myTags = await MenuItem.aggregate(
    [
      { $match: { createdBy: ObjectId(res.user._id) } },
      { $project: { _id: 0, tags: 1 } },
      { $unwind: { path: '$tags' } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
      { $sort: { tag: 1 } },
    ],
  );
  return res.send(myTags);
});

// Update Menu Item
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'store', 'vendor']), async (req, res) => {
  const updateValues = req.body;

  const canIAccess = await canIAccessRecord(res.user._id, req.params.id, 'createdBy', 'MenuItem');
  if (!canIAccess) { return res.status(400).send('permission error: access denied'); }

  const savedMenuItem = await MenuItem.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  }).populate([
    {
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
    {
      path: 'options',
    },
  ]);
  return res.send({ menuItem: savedMenuItem, message: 'Menu successfully updated' });
});

module.exports = router;
