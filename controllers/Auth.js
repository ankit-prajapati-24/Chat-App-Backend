const User = require('../models/User');
const OTP = require('../models/Otp');
const twilio = require('twilio');
require("dotenv").config();
exports.SendOtp = async (req, res) => {
    try {
        
        const accountSid = process.env.TWILIO_ACCOUNT_SID; // Use environment variable
        const authToken =  process.env.TWILIO_AUTH_TOKEN; // Use environment variable
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Use environment variable
        //console.log(accountSid,authToken,twilioPhoneNumber);
        const client = new twilio("AC01ab14dc01c0c7ac8ebb3700b2dd0f51", authToken);
        //console.log(client);
        const { Number ,ContryCode} = req.body;
        
        //console.log("req body",req.body);
        if (!Number) {
            return res.status(400).json({ error: 'Missing phone number' });
        }

        // Generate a random OTP (you can use a library like 'generate-otp')
        const otp = Math.floor(100000 + Math.random() * 90000).toString();

        // Send OTP via SMS
        // client.messages.create({
        //     body: `Your OTP is: ${otp}`,
        //     from: twilioPhoneNumber,
            // to: `${ContryCode}${Number}`, // Remove non-digit characters from the phone number
        // })
        // .then(async() => {
        //         res.status(200).json({ success: true, message: `OTP sent successfully to ${to}`,otp: otp  });
            const isOtp = await OTP.findOne({Number:Number});
            //console.log(isOtp);
            if(isOtp) {
                
                //console.log("OTP  PRESENT UPdating...");
                isOtp.Otp = otp;
                await isOtp.save();
                //console.log("otp is her",otp);
                res.status(200).json({ success: true, message: `OTP sent successfully to ${Number}`,otp: otp  });
            }
            else{
                //console.log("OTP NOT PRESENT CREATING NEW ONE");
                const otpDetails = await OTP.create({Number:Number,Otp:otp});
                //console.log(otpDetails,"otp is her",otp);
                res.status(200).json({ success: true, message: `OTP sent successfully to ${Number}`,otp: otp  });   
            }
        // })
        // .catch((error) => {
        //     res.status(500).json({ error: 'Failed to send OTP', details: error.message });
        // });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Error occurred while sending OTP',
        });
    }
};

exports.Login = async (req, res) => {
    try {
        //console.log('ready for login ',req.body);
        const { Number, UserOTP } = req.body;
        const user = await User.findOne({Number:Number});
        const otps = await OTP.findOne({ Number :Number});
        //console.log(otps);

        if(user){
            //console.log('user is present ', user);
            if (otps && UserOTP == otps.Otp) {
                res.status(200).json({
                    user:user,
                    success: true,
                    msg: "Login successful",
                });
            } else {
                res.status(401).json({
                    success: false,
                    msg: "Invalid OTP",
                });
            }
        }else{
            //console.log('user is not  present craeting new one');
            if (otps && UserOTP == otps.Otp) {
                //console.log('Otp validate and now creagtin user');
                const user = await User.create({Number:Number});
                //console.log("user created",user);
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
        }
         
    }
    catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || 'Error occurred during login',
        });
    }
};
