const mongoose = require('mongoose');

const { Schema } = mongoose;

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    prices: [
      {
        amount: {
          type: Number,
          required: true
        },
        currency: {
          type: String,
          required: true
        }
      }
    ],
    type: {
      type: String,
      enum: ['item', 'configurable', 'bundle'],
      default: 'item',
    },
    tags: {
      type: Array,
    },
    options: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: ['MenuOption'],
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

// module.exports = mongoose.model('MenuItem', menuItemSchema);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
// module.exports = { MenuItem, menuItemSchema };
module.exports = MenuItem;
