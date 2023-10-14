const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    charityName: {
      type: String,
      required: true,
    },
    charityEmail: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    charityPhone: {
      type: String,
      required: false,
    },
    charityContactFirstname: {
      type: String,
      required: false,
    },
    charityContactLastname: {
      type: String,
      required: false,
    },
    charityABN: {
      type: String,
      required: false,
    },
    charityLogo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'deleted', ''],
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
const Charity = mongoose.model('Charity', charitySchema);
module.exports = Charity;
