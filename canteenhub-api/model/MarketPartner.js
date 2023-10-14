const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const marketPartnerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique : true,
  },
  link: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  partnerLogo: {
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
marketPartnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MarketPartner', marketPartnerSchema);
