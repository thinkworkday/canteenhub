const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const marketFeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : true,
  },
  content: {
    type: String,
    required: true,
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
marketFeedbackSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MarketFeedback', marketFeedbackSchema);
