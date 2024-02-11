const mongoose = require("mongoose");

const RoomSchmea = mongoose.Schema({
    RoomId: {
        type: String,
    },
    Messages: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
           
        }
    ]
});

module.exports = mongoose.model("Room", RoomSchmea);
