const mongoose = require('mongoose');

const subgroupSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    contactFirstName: {
      type: String,
    },
    contactLastName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    type: {
      type: String,
      enum: ['classroom'],
      required: true,
    },
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

module.exports = mongoose.model('Subgroup', subgroupSchema);
