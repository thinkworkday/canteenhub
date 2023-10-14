const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const marketSchoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    unique : true,
  },

  schoolLogo: {
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
marketSchoolSchema.plugin(uniqueValidator);

module.exports = mongoose.model('MarketSchool', marketSchoolSchema);
