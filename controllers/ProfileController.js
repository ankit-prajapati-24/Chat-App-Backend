const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require("dotenv").config();
exports.UpdateProfile = async (req, res) => {
    try {
        const { Number, Name } = req.body;
        const image = req.files.Image;
        console.log(Number, Name, image);

        const user = await User.findOne({ Number: Number });
        if (!user) {
            return res.status(404).json({ error: 'UserNotFound', message: 'User not found' });
        }

        // const userImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
        console.log("ready for upload");
        const userImage = await uploadImageToCloudinary(req.files.Image,"MYCLOUDE");
        console.log("done upload");
        
        user.Image = userImage.secure_url;
        user.Name = Name;
        await user.save();

        res.status(200).json({ data: { user }, message: 'Profile update successful' });
    } catch (err) {
        res.status(500).json({ error: 'InternalServerError', message: err.message });
    }
};
exports.getAllUsers = async(req, res) => {
    try{
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
        console.log(err);
    }

};
