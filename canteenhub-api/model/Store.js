const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  storeEmail: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  storePhone: {
    type: String,
    required: false,
  },
  storeUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  }],
  status: {
    type: String,
    enum: ['pending', 'active', 'declined', 'deleted', ''],
    default: 'active',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  storeAddress: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  }],
  storeLogo: {
    type: String,
  },
  stripeAccountId: {
    type: String,
  },
  stripeAccountStatus: {
    type: String,
    enum: ['not started', 'in progress', 'active', 'declined'],
    default: 'not started',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('Store', storeSchema);
