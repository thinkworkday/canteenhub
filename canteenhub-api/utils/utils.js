/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const crypto = require('crypto');
const moment = require('moment');
const {
  createAccessCode,
} = require('./accessCode-service');

// ** models
const Administrator = require('../model/Administrator');
const User = require('../model/User');
const Store = require('../model/Store');
// const MenuItem = require('../model/MenuItem');

const convertToCamelCase = (str) => {
  const arr = str.match(/[a-z]+|\d+/gi);
  return arr.map((m, i) => {
    let low = m.toLowerCase();
    if (i !== 0) {
      low = low.split('').map((s, k) => (k === 0 ? s.toUpperCase() : s)).join``;
    }
    return low;
  }).join``;
};

const formatGoogleAddress = (addressObj) => {
  const address = addressObj.address_components.reduce((seed, { short_name, types }) => {
    types.forEach((t) => {
      const fieldName = convertToCamelCase(t);
      seed[fieldName] = short_name;
    });
    return seed;
  }, {});
  address.formattedAddress = addressObj.formatted_address;
  address.lat = addressObj.geometry.location.lat;
  address.lng = addressObj.geometry.location.lng;
  return address;
};

const generateResetPasswordURL = async (userObjId) => {
  const accessCode = await createAccessCode({
    resourceReference: userObjId,
    resourceName: 'User',
    kind: 'PasswordReset',
    expiresAt: new Date(Date.now() + 2 * (60 * 60 * 1000)), // 2 hour expiry
  });
  return `${process.env.FRONTEND_URL}/reset-password/${accessCode.code}`;
};

const generateInviteURL = async (inviteObjId) => `${process.env.FRONTEND_URL}/invitation/${inviteObjId}`;

const generateVerifyEmailURL = async (userObjId) => {
  const accessCode = await createAccessCode({
    resourceReference: userObjId,
    resourceName: 'User',
    kind: 'EmailVerification',
    expiresAt: new Date(Date.now() + 24 * (60 * 60 * 1000)), // 24 hour expiry
  });
  return `${process.env.FRONTEND_URL}/verify-email/${accessCode.code}`;
};

// create random password (if not provided)
const generateRandomString = async () => {
  const generatePassword = (
    length = 10,
    wishlist = '0123456789abcdefghijklmnopqrstuvwxyz',
  ) => Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

  return (generatePassword());
};

// ** can vendor access user?
// returns Boolean
const canIAccessUser = async (vendorObjId, userObjId) => {
  let reqUser;
  reqUser = await User.findById(vendorObjId).select('role');
  if (!reqUser) { reqUser = await Administrator.findById(vendorObjId).select('role'); }
  if (!reqUser) { return false; }

  // 1. First check vendor is a vendor
  if (reqUser.role === 'admin') {
    return true;
  }
  if (reqUser.role === 'vendor') {
    const user = await User.findOne({ _id: userObjId, parentVendor: ObjectId(vendorObjId.toString()) }).select('_id');
    return (!!user);
  }
  return (false);
};

// ** can vendor access user?
// returns Boolean
const canIAccessRecord = async (userObjId, recordObjId, recordFieldRef, recordResource) => {
  // if admin, then allow
  const reqAdmin = await Administrator.findById(userObjId).select('role');
  if (reqAdmin) {
    return true;
  }
  // else check record is created by the user
  const record = await mongoose.model(recordResource).findOne({ _id: recordObjId, recordFieldRef: userObjId }).select('createdBy createdByModel');
  if (record) {
    return true;
  }
  return (false);
};

// ** can vendor access store?
// returns Store if true
const canVendorAccessStore = async (vendorObjId, storeObjId) => {
  const canVendorAccessStoreQuery = vendorObjId ? { _id: storeObjId, vendor: vendorObjId } : { _id: storeObjId };
  const storeFound = await Store.findOne({ canVendorAccessStoreQuery });
  if (!storeFound) { return false; }
  return storeFound;
};

// Converts numeric degrees to radians
function toRad(Value) {
  return ((Value * Math.PI) / 180);
}

// ** Location - Calculate distance between 2 points (As Crow Flies)
function getDistanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

const formatDate = (value, formatting = 'full') => {
  if (!value) return value;

  const formattedDate = formatting === 'full' ? moment(`${value}`).format('llll') : moment(`${value}`).format('ddd, Do MMM YYYY');

  return formattedDate;
  // return new Intl.DateTimeFormat('en-AU', formatting).format(new Date(value));
};

const deliveryFormatDate = (value) => {
  if (!value) return value;

  const formattedDate = moment(value).format('ddd, MMM DD, YYYY');
  return formattedDate;
}

// ** Returns price format
const formatPrice = (num) => (`$${Number(num).toFixed(2).toLocaleString()}`);

const getDeliveryDate = (orderDate, deliveryTime) => {
  const formattedDate = moment(orderDate).format('YYYY-M-D'); // '2017-03-13';
  const convertTime12to24 = deliveryTime ? moment(deliveryTime, 'hh:mm A').format('HH:mm') : '';
  const formattedDateMoment = moment(`${formattedDate} ${convertTime12to24}`, 'YYYY-MM-DD HH:mm:ss A');
  const timeAndDate = deliveryTime ? moment(formattedDateMoment).format('llll') : moment(`${formattedDate}`, 'YYYY-MM-DD HH:mm:ss A').format('llll');
  return timeAndDate;
};
const getCutOffDate = (orderDate, cutoffPeriod, showAsFrom) => {
  const cutOffDate = showAsFrom ? moment(orderDate).subtract(cutoffPeriod, 'hours').fromNow() : moment(orderDate).subtract(cutoffPeriod, 'hours').format('llll');
  return cutOffDate;
};

const isInThePast = (date) => moment(new Date(date), 'hh:mm A').format('YYYY-MM-DD HH:mm:ss A') < moment(new Date(), 'hh:mm A').format('YYYY-MM-DD HH:mm:ss A');

const isInThePastUTC = (date) => {
  const today = new Date();
  return date < today;
};

module.exports = {
  convertToCamelCase,
  formatGoogleAddress,
  generateResetPasswordURL,
  generateInviteURL,
  generateRandomString,
  generateVerifyEmailURL,
  canIAccessUser,
  canIAccessRecord,
  canVendorAccessStore,
  getDistanceBetween,
  formatDate,
  formatPrice,
  getDeliveryDate,
  getCutOffDate,
  isInThePast,
  isInThePastUTC,
  deliveryFormatDate,
};
