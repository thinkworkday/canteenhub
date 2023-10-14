const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    menuData: [{
      type: Object,
    }],
    vendors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    menuParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
    menuItemModifications: [{
      type: Object,
    }],
    menuOptionModifications: [{
      type: Object,
    }],
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'deleted', ''],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: ['User', 'Administrator'],
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

module.exports = mongoose.model('Menu', menuSchema);
