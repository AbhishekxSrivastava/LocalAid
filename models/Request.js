const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true }); // This line adds `createdAt` and `updatedAt` fields

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
