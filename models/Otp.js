const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema({
    Number:{
        type: String,
    },
    Otp:{
            type: String,
            expire:Date.now() + (5 * 60 * 60 * 24 * 60 )
        }
});

module.exports = mongoose.model("OTP", OTPSchema);
