const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const marketContentSchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: true,
    unique : true,
    enum: ['land', 'parents', 'schools', 'store'],
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  contentLogo: {
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
marketContentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MarketContent', marketContentSchema);
