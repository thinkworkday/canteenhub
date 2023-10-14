const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema(
  {
    // orderNumber: {
    //   type: Number,
    //   required: true,
    // },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    // profile: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Profile',
    // }],
    profile: [{
      type: Object,
    }],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    charitySettings: [{
      type: Object,
    }],
    orderLines: [{
      type: Object,
    }],
    orderTotals: [{
      type: Object,
    }],
    status: {
      type: String,
      enum: ['partial', 'pending', 'active', 'refunded', 'deleted', 'fulfilled', 'cancelled'],
      default: 'active',
    },
    labelPrinted: {
      type: Boolean,
      default: false,
    },
    transactionData: [{
      type: Object,
    }],
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

orderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber', start_seq: 1000 });

module.exports = mongoose.model('Order', orderSchema);
