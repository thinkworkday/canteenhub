/* eslint-disable no-nested-ternary */
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
// const bcrypt = require('bcrypt');
// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const request = require('request-promise');
const querystring = require('querystring');
const config = require('../config');

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// ** Models
const Administrator = require('../model/Administrator');
const User = require('../model/User');
const Store = require('../model/Store');
const Address = require('../model/Address');

// ** utils
const { canVendorAccessStore } = require('../utils/utils');
const { fetchStoreUserVendor } = require('../utils/storeFunctions');

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

// ** SendGrid
// const sendEmail = require('../utils/sendGrid/sendEmail');
// const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

const { formatGoogleAddress } = require('../utils/utils');
const { storeValidation } = require('../utils/validation');

// ** Get Stores
router.get('/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)

  // if store user - get parent vendor
  let storeUser;
  let storeUserStores;
  if (res.user.role === 'store') {
    storeUser = await User.findById(res.user._id).select('parentVendor');
    storeUserStores = await Store.find({ storeUsers: { $all: [res.user._id] } }).select('_id');
    storeUserStores = await storeUserStores.map((num) => num._id);
  }

  // eslint-disable-next-line no-nested-ternary
  const vendorFilter = res.user.role === 'admin' ? { vendor: ObjectId(req.query.vendor) } : res.user.role === 'store' ? { vendor: storeUser.parentVendor[0] } : { vendor: ObjectId(res.user._id) };
  const storeFilter = res.user.role === 'store' ? { _id: { $in: storeUserStores } } : {};
  const statusFilter = { status: { $ne: 'deleted' } };
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';

  const filterParams = {
    $and: [
      {
        $or: [{ storeName: { $regex: searchQuery, $options: 'i' } }],
      },
      vendorFilter,
      storeFilter,
      statusFilter,
    ],
  };

  const totalCount = await Store.countDocuments({
    $and: [vendorFilter, statusFilter],
  });

  const stores = await Store.aggregate(
    [
      {
        $match: filterParams,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'storeUsers',
          foreignField: '_id',
          as: 'storeUsers',
        },
      },
      {
        $project: { 'storeUsers.password': 0, 'storeUsers.ability': 0 },
      },
    ],
  );

  return res.send({
    totalCount,
    filteredCount: stores.length,
    results: stores,
  });
});

// ** Get Store
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // router.get('/:id', verifyUser(['admin', 'vendor']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const reqAdministrator = await Administrator.findById(res.user._id).select('role');
  const reqUserInfo = await User.findById(res.user._id).select('role');
  const reqUser = reqAdministrator || reqUserInfo;
  if (!reqUser) {
    return res.status(400).send('Admin or Vendor does not exist');
  }

  let matchClause;
  if (reqUser.role === 'admin') {
    matchClause = { _id: ObjectId(req.params.id) };
  } else {
    matchClause = {
      _id: ObjectId(req.params.id),
      vendor: res.user.role === 'store' ? await fetchStoreUserVendor(res.user._id) : ObjectId(res.user._id),
    };
  }

  const store = await Store.aggregate(
    [
      {
        $match: matchClause,
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'storeAddress',
          foreignField: '_id',
          as: 'storeAddress',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'storeUsers',
          foreignField: '_id',
          as: 'storeUsers',
        },
      },
      {
        $project: {
          'storeUsers.password': 0,
          'storeUsers.ability': 0,
        },
      },
    ],
  );

  if (!store) {
    return res
      .status(400)
      .send('User not found or you do not have permission to view');
  }
  return res.send(store);
});

// ** Create Store
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  // const checkRole =  verifyUser(['admin', 'vendor']);
  const storeData = req.body;
  // validate request
  const { error } = storeValidation(storeData);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const store = new Store({
    ...storeData,
  });
  // console.log('storeData:', storeData);
  try {
    const savedStore = await store.save();

    // Save the address
    const { addressObj } = req.body;
    let savedAddress;
    if (addressObj) {
      const address = new Address(formatGoogleAddress(addressObj));
      savedAddress = await address.save();
      if (savedAddress) {
        await savedStore.updateOne({
          $push: {
            storeAddress: {
              _id: savedAddress._id,
            },
          },
        });
      }
    }

    return res.send({
      store: savedStore,
      message: 'Store successfully created',
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

// ** Update Stores
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  const updateValues = req.body;
  console.log(updateValues, 'dddd');
  // check if vendor can access user (via parentVendor)
  const vendorPermission = await canVendorAccessStore(
    res.user._id,
    req.params.id,
  );
  if (!vendorPermission) {
    return res.status(400).send('permission error: cannot delete this user');
  }

  try {
    const savedStore = await Store.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    // Updated the address (if changed)
    const { addressObj } = req.body;
    if (addressObj) {
      const address = formatGoogleAddress(addressObj);
      await Address.findOneAndUpdate(
        { _id: '61a8bbb7d102c673ed5aff95' },
        address,
        {
          new: true,
        },
      );
    }

    return res.send({
      store: savedStore,
      message: 'Store successfully updated',
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

// ** Create a Stripe Connected Accoint **
router.post('/stripe/connectedAccount/generateUrl', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  const data = req.body;

  let storeId = '';
  storeId = data._id;
  let parameters = {
    client_id: config.stripe.clientId,
    state: Math.random().toString(36).slice(2),
  };
    // Optionally, the Express onboarding flow accepts `first_name`, `last_name`, `email`,
    // and `phone` in the query parameters: those form fields will be prefilled
  parameters = Object.assign(parameters, {
    redirect_uri: `${config.server_url}/api/stores/return`,
    'stripe_user[business_type]': data.type || 'individual',
    'stripe_user[business_name]': data.storeName || undefined,
    'stripe_user[first_name]': data.storeUsers[0] ? data.storeUsers[0].firstName : undefined,
    'stripe_user[last_name]': data.storeUsers[0] ? data.storeUsers[0].lastName : undefined,
    'stripe_user[email]': data.storeEmail || undefined,
    'stripe_user[country]': 'AU' || data.country || undefined,
    // If we're suggesting this account have the `card_payments` capability,
    // we can pass some additional fields to prefill:
    // 'suggested_capabilities[]': 'card_payments',
    // 'stripe_user[street_address]': req.user.address || undefined,
    // 'stripe_user[city]': req.user.city || undefined,
    // 'stripe_user[zip]': req.user.postalCode || undefined,
    // 'stripe_user[state]': req.user.city || undefined,
  });

  if (data.stripeAccountStatus === 'not started') {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'AU' || data.country || undefined,
      email: data.storeEmail || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: config.publicDomain,
      // return_url: `${config.server_url}/api/stores/return`,
      return_url: `${config.publicDomain}/vendor/store/edit/${storeId}/checkConnectedAccount`,
      type: 'account_onboarding',
    });
    const updateValues = {
      stripeAccountStatus: 'in progress',
      stripeAccountId: account.id,
    };
    await Store.findOneAndUpdate({ _id: storeId }, updateValues, {
      new: true,
    });
    // Define the mandatory Stripe parameters: make sure to include our platform's client ID

    res.send(`${accountLink.url}?${querystring.stringify(parameters)}`);
    // res.send(config.stripe.authorizeUri + '?' + querystring.stringify(parameters))
  } else {
    const accountLink = await stripe.accountLinks.create({
      account: data.stripeAccountId,
      refresh_url: config.publicDomain,
      // return_url: `${config.server_url}/api/stores/return?storeId=${storeId}`,
      return_url: `${config.publicDomain}/vendor/store/edit/${storeId}/checkConnectedAccount`,
      type: 'account_onboarding',
    });
    res.send(`${accountLink.url}?${querystring.stringify(parameters)}`);
  }
});

// Stripe Check Connected Account
router.get('/stripe/connectedAccount/checkStatus/:storeId', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId) return res.status(400).send('Invalid store id');

  const store = await Store.findById(storeId);
  // get the connected account
  const account = await stripe.accounts.retrieve(
    store.stripeAccountId,
  );

  if (account && account.payouts_enabled) {
    try {
      await Store.findOneAndUpdate({ _id: storeId }, { stripeAccountStatus: 'active' }, { new: true });
      return res.send({
        message: 'Connected account set to active',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('The Stripe onboarding process has not succeeded.');
      next(err);
    }
  }

  return res.status(400).send('No change to connected account');
});

module.exports = router;
