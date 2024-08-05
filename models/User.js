const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    number: {
        type: String,
    },
    
    email: {
        type: String,
    },

    image: {
        type: String,
        default:"https://th.bing.com/th/id/OIP.CH6BOupuCACSNxTGJJnrkAAAAA?w=474&h=474&rs=1&pid=ImgDetMain"
    },
    about:{
        type: String,
    },
    Chats:[
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room"
            },
    ],
    myconnections:[
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
],
});

module.exports = mongoose.model("User", UserSchema);
