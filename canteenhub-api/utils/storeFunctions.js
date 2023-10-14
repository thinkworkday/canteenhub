// ** Models
const User = require('../model/User');
const Store = require('../model/Store');
const Event = require('../model/Event');

const fetchStoreUserVendor = async (storeUserId) => {
  const storeUser = await User.findById(storeUserId).select('parentVendor');
  return storeUser && storeUser.parentVendor ? storeUser.parentVendor[0] : '';
};

const fetchStoreUserStores = async (storeUserId) => {
  // get store user stores
  const storeUserStores = await Store.find({ storeUsers: { $all: [storeUserId] } }).select('_id');
  return storeUserStores && storeUserStores.length > 0 ? storeUserStores.map((store) => store._id) : {};
};

const fetchStoreUserEvents = async (storeUserId) => {
  const storeUserStores = await fetchStoreUserStores(storeUserId);
  const storeUserEvents = await Event.find({ store: { $in: storeUserStores } }).select('_id');
  return storeUserEvents && storeUserEvents.length > 0 ? storeUserEvents.map((event) => event._id) : {};
};

module.exports = {
  fetchStoreUserVendor,
  fetchStoreUserStores,
  fetchStoreUserEvents,
};
