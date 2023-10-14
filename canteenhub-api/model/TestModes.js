const mongoose = require('mongoose');

const TestModeSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

module.exports = mongoose.model('TestMode', TestModeSchema);