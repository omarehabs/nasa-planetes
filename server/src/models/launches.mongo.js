const mongoose = require('mongoose');

const launchesSchema = mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    customers: [String],
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
    target: {
        type: String,
    },
});
module.exports = mongoose.model('Launch', launchesSchema);
