const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subGroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subgroup',
    }],
    menus: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    }],
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'deleted', 'fulfilled'],
      default: 'pending',
    },
    date: {
      type: Date,
      required: true,
    },
    // dateOnly: {
    //   type: String,
    //   required: false,
    // },
    deliveryTime: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    cutoffPeriod: {
      type: Number,
      required: true,
    },
    deliveryDateTimeUTC: {
      type: Date,
      required: true,
    },
    cutoffDateTimeUTC: {
      type: Date,
      required: true,
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

module.exports = mongoose.model('Event', eventSchema);
