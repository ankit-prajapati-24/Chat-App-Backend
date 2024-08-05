const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require("dotenv").config();
exports.UpdateProfile = async (req, res) => {
    try {
        console.log("request accepted for updateProfile ",req.body);
        const { number} = req.body;
        const image = req.files.Image;
        console.log(number);

        const user = await User.findOne({ number });

        // const userImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
        if(image){
            console.log("ready for upload");
            const userImage = await uploadImageToCloudinary(image,"MYCLOUDE");
            console.log("done upload");
            user.image = userImage.secure_url;
        }
        await user.save();
        res.status(200).json({ data: { user }, message: 'Profile update successful' });
    } catch (err) {
        res.status(500).json({ error: 'InternalServerError', message: err.message });
    }
};
exports.getAllUsers = async(req, res) => {
    try{
        console.log('getAllUsers request successful');
        const users = await User.find({}).populate({
            path: 'Chats',
            populate: {
              path: 'Messages', // Assuming 'messages' is a field inside 'Chats', and 'Chats' is an array of Room documents
            },
          }).exec();
        res.status(200).json({users: users,success: true,message:"fetched users"});
    }
    catch(err){
        res.status(500).json({message:"profile update failed"});
        //console.log(err);
    }
};

// exports.addConnections = async(req,res) => {
//     try{
//           const {number,connection} = req.body;
//           const user = await findOneAndUpdate({number:number}
//             ,{$push:{myconnection:connection}},
//             { new: true}
//           )
//     }
//     catch(err){
//         console.log("error at addConnection",err);
//         return res.status(500).json({message:err.message});
//     }
// }
