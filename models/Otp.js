const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");


const OTPSchema = mongoose.Schema({
    Number:{
        type: String,
    },
    Email:{
        type: String,
    },
    Otp:{
            type: String,
            expire:Date.now() + (5 * 60 * 60 * 24 * 60 )
        }
});
async function sendVerificationEmail(Email, Otp) {
    try {
        const result = await mailSender(Email, "Verification Email from Chatsapp", MailTemplate(Otp));
        console.log(result);
    } catch (err) {
        console.log("Error in OTP verification", err);
        throw err;
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.Email, this.Otp);
    next();
});
function  MailTemplate(Otp){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        /* Ensure styles are inline to maximize compatibility with email clients */
        .container {
            width: 100%;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .email-wrapper {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333333;
        }
        .otp {
            font-size: 36px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
        }
        .message {
            font-size: 16px;
            color: #555555;
            text-align: center;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #aaaaaa;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">Your OTP Code </div>
            <div class="message">Please use the following OTP code to complete your login:</div>
            <div class="otp">${Otp}</div>
            <div class="message">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</div>
            <div class="footer">Thank you for using our service!</div>
        </div>
    </div>
</body>
</html>
    `
 }
module.exports = mongoose.model("OTP", OTPSchema);
