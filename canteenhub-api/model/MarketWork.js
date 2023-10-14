const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const marketWorkSchema = new mongoose.Schema({
  workTitle: {
    type: String,
    required: true,
    unique : true,
  },
  workContent: {
    type: String,
    required: true,
    unique : true,
  },
  workLogo: {
    type: String,
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

// Apply the uniqueValidator plugin to userSchema.
marketWorkSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MarketWork', marketWorkSchema);
