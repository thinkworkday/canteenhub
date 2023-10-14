const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
