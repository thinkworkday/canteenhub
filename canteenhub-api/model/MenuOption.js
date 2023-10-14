const mongoose = require('mongoose');

const { Schema } = mongoose;

const menuOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    multiSelect: {
      type: Boolean,
    },
    mandatory: {
      type: Boolean,
    },
    options: [{
      type: Object,
    }],
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'deleted', ''],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'createdByModel',
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ['User', 'Administrator'],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = mongoose.model('MenuOption', menuOptionSchema);
