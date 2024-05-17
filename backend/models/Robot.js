const mongoose = require('mongoose');
const robotSchema = new mongoose.Schema({
    batteryLevel : Number,
    operationalStatus: String,
    activityLogs: [{type:String}],
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Robot',robotSchema);
