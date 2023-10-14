const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
const { canIAccessRecord } = require('../utils/utils');

// ** Models
const Menu = require('../model/Menu');
const MenuItem = require('../model/MenuItem');
const MenuOption = require('../model/MenuOption');

const {
  menuOptionValidation,
} = require('../utils/validation');

// ** Create Menu Option
router.post('/create', verifyUser(['admin']), async (req, res) => {
  const menuOptionData = req.body;
  menuOptionData.createdBy = res.user._id;
  menuOptionData.createdByModel = (res.user.role === 'admin' ? 'Administrator' : 'User');

  // if item object id is provided, then assign to menu item
  const itemObjId = (req.body.itemObjId ? req.body.itemObjId : '');
  if (itemObjId) {
    delete menuOptionData.itemObjId;
  }

  // validate request
  const { error } = menuOptionValidation(menuOptionData);
  if (error) { return res.status(400).send(error.details[0].message); }

  const menuOption = new MenuOption(menuOptionData);
  try {
    const savedMenuOption = await menuOption.save();

    if (itemObjId) {
      // attach to item if item ID is provided
      await MenuItem.updateOne(
        { _id: itemObjId },
        { $push: { options: savedMenuOption._id } },
      );
    }

    return res.send({ menuOption: savedMenuOption, message: 'Menu option successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** List Menu Options (All)
router.get('/list/', verifyUser(['admin']), async (req, res) => {
  const statusFilter = { status: { $ne: 'deleted' } };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
  const filterParams = {
    $and: [
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
        // { companyName: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      // vendorFilter,
      statusFilter,
    ],
  };

  const totalCount = await MenuOption.countDocuments({
    $and: [
      // vendorFilter,
      statusFilter,
    ],
  });

  const menus = await MenuOption.find(filterParams).populate([
    {
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    },
    // {
    //   path: 'options',
    // },
  ]);

  return res.send({
    totalCount,
    filteredCount: menus.length,
    results: menus,
  });
});

// ** List Menu Options by Menu
router.get('/listByMenu/:menuId', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const { menuId } = req.params;

  // const statusFilter = { status: { $ne: 'deleted' } };
  const options = await Menu.aggregate(
    [
      { $match: { _id: ObjectId(menuId) } },
      { $unwind: { path: '$menuData' } },
      { $replaceRoot: { newRoot: '$menuData' } },
      { $unwind: { path: '$items' } },
      {
        $lookup: {
          from: 'menuitems',
          let: { itemID: '$items' },
          pipeline: [{ $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$itemID'] } } }],
          as: 'items',
        },
      },
      { $project: { 'items.options': 1 } },
      { $unwind: { path: '$items' } },
      { $replaceRoot: { newRoot: '$items' } },
      { $unwind: { path: '$options' } },
      { $group: { _id: '$options' } },
      {
        $lookup: {
          from: 'menuoptions',
          localField: '_id',
          foreignField: '_id',
          as: 'optionGroup',
        },
      },
      { $unwind: { path: '$optionGroup' } },
      { $replaceRoot: { newRoot: '$optionGroup' } },
      {
        $project: {
          createdBy: 0,
          createdByModel: 0,
        },
      },
      { $sort: { name: 1 } },
    ],
  );

  return res.send({
    results: options,
  });
});

// Update Menu Option
router.patch('/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;

  const canIAccess = await canIAccessRecord(res.user._id, req.params.id, 'createdBy', 'MenuOption');
  if (!canIAccess) { return res.status(400).send('permission error: access denied'); }

  const savedMenuOption = await MenuOption.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  });
  return res.send({ menuOption: savedMenuOption, message: 'Menu option successfully updated' });
});

module.exports = router;
