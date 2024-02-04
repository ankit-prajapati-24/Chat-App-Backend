const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    Name: {
        type: String,
    },
    Number: {
        type: Number,
    },
    MessageText: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Message", MessageSchema);
