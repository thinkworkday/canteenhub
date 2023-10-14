const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;
const settingsSchema = new mongoose.Schema(
  {
    defaultCommission: {
      type: SchemaTypes.Double,
      default: 0.06,
    },
  },
);

module.exports = mongoose.model('Settings', settingsSchema);
