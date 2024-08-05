const User = require('../models/User');
const OTP = require('../models/Otp');
const Room = require('../models/RoomChat');
const twilio = require('twilio');
require("dotenv").config();
exports.SendOtp = async (req, res) => {
    try {
      
        console.log("req body", req.body);
        const { Email,Number } = req.body;
        // Generating a random OTP
        const otp = Math.floor(100000 + Math.random() * 90000).toString();
        console.log("otp", otp);
        const otpschema = await OTP.create({Email: Email,Number:Number, Otp:otp})
            console.log("sent otp",otpschema);
            res.status(200).json({ success: true, message: `OTP sent successfully to ${Email}`, otp: otp });
        }  
     catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({
            success: false,
            msg: err.message || 'Error occurred while sending OTP',
        });
    }
};

exports.Login = async (req, res) => {
    try {
        console.log('ready for login ',req.body);
        const { Number, Password } = req.body;
        const user = await User.findOne({number:Number});
        // const otps = await OTP.findOne({ Number :Number});
        //console.log(otps);
        if(user){
            //console.log('user is present ', user);
            if (Password == user.password ) {
                res.status(200).json({
                    user:user,
                    success: true,
                    msg: "Login successful",
                });
            } else {
                res.status(401).json({
                    success: false,
                    msg: "Invalid Password",
                });
            }
        }else{
                res.status(401).json({
                    success: false,
                    msg: "User dosn't present",
                });
        }
         
    }
    catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Error occurred during login',
        });
    }
};

exports.Signup = async (req, res) => {
    try {
        console.log('Ready for login', req.body);
        const { Number, UserOTP, Name, Password ,Email} = req.body;

        // Find the OTP for the provided number
        const otps = await OTP.findOne({ Number: Number });
        console.log(otps);

        if (otps && UserOTP === otps.Otp) {
            console.log('OTP validated, now creating user');
            
            // Create the user if OTP is validated
            const room = await Room.create({
                RoomId : Date.now(),
                Messages: [],
            });
            
            const user = await User.create({ number: Number, name: Name, password: Password ,Chats:[room._id],email:Email});
            console.log("User created", user);
            
            res.status(200).json({
                success: true,
                user: user,
                msg: "Login successful",
            });
        } else {
            res.status(401).json({
                success: false,
                msg: "Invalid OTP",
            });
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        res.status(500).json({
            success: false,
            msg: 'Error occurred during login',
        });
    }
};
