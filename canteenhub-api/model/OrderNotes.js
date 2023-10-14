const mongoose = require('mongoose');

const orderNotesSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    noteParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderNote',
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'deleted', ''],
      default: 'pending',
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

module.exports = mongoose.model('OrderNote', orderNotesSchema);
