const mongoose = require("mongoose");

function gettime() {
    // Function to get current time
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var currentTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + meridiem;
    return currentTime;
  }

const MessageSchema = mongoose.Schema({
    Name: {
        type: String,
    },
    Number: {
        type: Number,
    },
    MessageText: {
        type: String,
    },
    Image:{
        type: String,
    },
    date: {
        type: String,
        // default:gettime()
    }, 
});

module.exports = mongoose.model("Message", MessageSchema);
