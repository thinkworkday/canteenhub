const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    event: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    vendor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    fulFilledOrders: {
      type: Object,
    },
    // commissionAmount: {
    //   type: Number,
    // },
    payoutAmount: {
      type: Number,
    },
    // totalAmount: {
    //   type: Number,
    // },
    stripeReponse: [{
      type: Array,
    }],
    type: {
      type: String,
      enum: ['payout', 'refund'],
      default: 'payout',
    },
    status: {
      type: String,
      enum: ['pending', 'transfer', 'completed'],
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

module.exports = mongoose.model('Transaction', transactionSchema);
