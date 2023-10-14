const mongoose = require('mongoose');
const { roles } = require('../config/roles');

const inviteSchema = new mongoose.Schema(
  {
    inviteFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toCompanyName: {
      type: String,
      required: true,
    },
    toFirstName: {
      type: String,
      required: true,
    },
    toLastName: {
      type: String,
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    toPhone: {
      type: String,
      required: false,
    },
    toRole: {
      type: String,
      enum: roles,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = mongoose.model('Invite', inviteSchema);
