const mongoose = require('mongoose');

const NewYearSchoolStartSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

module.exports = mongoose.model('NewYearSchoolStart', NewYearSchoolStartSchema);