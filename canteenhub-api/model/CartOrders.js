const mongoose = require('mongoose');

const cartOrderSchema = new mongoose.Schema(
  {

    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profile: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    }],
    orderLines: [{
      type: Object,
    }],
    orderTotals: [{
      type: Object,
    }],
    status: {
      type: String,
      enum: ['inprogress', 'expired'],
      default: 'inprogress',
    },
    currentStep: {
      type: Number,
      default: 2, // create only occurs when first step is clicked, therefore make this 2
    },
    currentMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
    stripePaymentIntent: {
      type: Object,
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

module.exports = mongoose.model('CartOrder', cartOrderSchema);
