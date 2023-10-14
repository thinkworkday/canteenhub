const mongoose = require('mongoose');

const CheckNewYearLoginSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        }
    }, 
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
    },
});

module.exports = mongoose.model('CheckNewYearLogin', CheckNewYearLoginSchema);