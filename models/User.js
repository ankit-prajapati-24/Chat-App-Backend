const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    Name: {
        type: String,
    },
    Number: {
        type: String,
    },
    Image: {
        type: String,
        default:"https://th.bing.com/th/id/OIP.CH6BOupuCACSNxTGJJnrkAAAAA?w=474&h=474&rs=1&pid=ImgDetMain"
    },
    About:{
        type: String,
    },
    Chats:[
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
                unique: true
            }
    ]
});

module.exports = mongoose.model("User", UserSchema);
