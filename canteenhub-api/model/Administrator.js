const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    role: {
      type: String,
      default: 'admin',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'deleted', ''],
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    ability: {
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = mongoose.model('Administrator', administratorSchema);
