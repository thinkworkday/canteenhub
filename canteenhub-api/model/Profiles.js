const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    notes: {
      type: String,
    },
    allergies: {
      type: Object,
      required: false,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subgroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subgroup',
    }],
    status: {
      type: String,
      enum: ['active', 'deleted'],
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

module.exports = mongoose.model('Profile', profileSchema);
