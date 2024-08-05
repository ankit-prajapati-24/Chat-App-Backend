const Message = require('../models/MessageSchema');
const User = require('../models/User');
const Room = require('../models/RoomChat');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { connection } = require('mongoose');
const { Receive } = require('twilio/lib/twiml/FaxResponse');
const { populate } = require('dotenv');
require("dotenv").config();
exports.getChats = async (req, res) => {

    try {
        const { Number } = req.body;
        const chats = await User.find({ Number: Number }).populate("Chats").exec();
        //console.log(chats);
        res.status(200).json({
            chats: chats,
        })
    }
    catch (err) {
        //console.error(err);
        res.send(err);
    }
}

exports.getMyconnections = async (req, res) => {
    try {
        console.log("request accepted at getmyconnections", req.body);
        const { number } = req.body;
        const connections = await User.findOne({ number: number }).populate({
            path: "myconnections",
            populate:
            {
                path: "Chats",
                populate: {
                    path: "Messages",
                }
            }
     }
          ).exec();
        //   console.log(" my connection ", connections);
        return res.status(200).json({
            myconnection: connections.myconnections
        });
    }
    catch (err) {
        console.log("error at getmyconnections", err);
    }
}
exports.getRoomChat = async (req, res) => {

    try {
        console.log("getRoomChat req. accept", req.body);
        const { sender, reciever } = req.body;
        const Roomid = `${sender}${reciever}`;
        const existRoomid = `${reciever}${sender}`;
        console.log(Roomid, existRoomid);
        let chats = await Room.findOne({ RoomId: Roomid }).populate("Messages").exec();
        if (!chats) {
            chats = chats = await Room.findOne({ RoomId: existRoomid }).populate("Messages").exec();
        }
        // console.log('here is chats',chats);
        res.status(200).json({
            chats: chats,
        })
    }
    catch (err) {
        //console.error(err);
        res.send(err);
    }
}


exports.addMessageInRoom = async (sender, reciever, MessageText, Name, Number, Date) => {
    try {

        // Find the room by RoomId
        console.log("adding message in room");
        const existsRoomId = `${sender}${reciever}`;
        const newRoomId = `${reciever}${sender}`;
        console.log("this is room id", existsRoomId, newRoomId);
        let RoomId = existsRoomId;
        console.log("step 1");
        let room = await Room.findOne({ RoomId: existsRoomId });
        console.log("step 2");
        if (!room) {
            RoomId = newRoomId;
            room = await Room.findOne({ RoomId: newRoomId });
        }
        console.log("step 3");
        if (!room) {
            console.log(" If the room doesn't exist, create a new room");
            room = await Room.create({
                RoomId: newRoomId,
                Messages: [],
            });
        }
        console.log("step 4");
        // Create a new message
        console.log(sender, reciever, "message", MessageText, "image", Name, Number, Date);
        const newMessage = await Message.create({
            RoomId,
            MessageText,
            Name,
            Number,
            date: Date
        });

        console.log("mesg created ", newMessage);

        // Add the new message to the room's Messages array
        room.Messages.push(newMessage._id);

        // Save the updated room
        await room.save();

        const nextuser = await User.findOne({ number: reciever }).populate('myconnections').exec();
        console.log("Updated room now adding conecntions");
        const user = await User.findOne({ number: sender }).populate('Chats').populate('myconnections').exec();
        // Log the user details for debugging purposes

        // console.log('me',user);
        // console.log('my friend',nextuser);
        const existConnection = user.myconnections.some(connection => connection.number == reciever);
        const existnextConnection = nextuser.myconnections.some(connection => connection.number == sender);
        if (!existConnection) {
            user.myconnections.push(nextuser._id);
            await user.save();
        }
        if (!existnextConnection) {
            nextuser.myconnections.push(user._id);
            await nextuser.save();
        }
        // console.log("all right",user,nextuser);
        // const user = await User.findOne({ Number: Number }).populate('Chats').exec();

        // Log the user details for debugging purposes
        const exists = user.Chats.some(chat => chat._id.toString() === room._id.toString());

        if (!exists) {
            // Add the room ID to the user's chats
            user.Chats.push(room._id);

            // Save the user document with the updated chats
            await user.save();

            //console.log('Room added to user chats:', room._id);
        } else {
            //console.log('Room already exists in user chats:', room._id);
        }
        return { success: true, message: 'Message added successfully', user };
    } catch (error) {
        // Handle any errors during the process
        return { success: false, message: error.message || 'Error adding message to room' };
    }
};
exports.addImageInRoom = async (sender, reciever, Image, Name, Number, Date) => {
    try {

        // Find the room by RoomId
        console.log("adding message in room");
        const existsRoomId = `${sender}${reciever}`;
        const newRoomId = `${reciever}${sender}`;
        console.log("this is room id", existsRoomId, newRoomId);
        let RoomId = existsRoomId;
        console.log("step 1");
        let room = await Room.findOne({ RoomId: existsRoomId });
        console.log("step 2");
        if (!room) {
            RoomId = newRoomId;
            room = await Room.findOne({ RoomId: newRoomId });
        }
        console.log("step 3");
        if (!room) {
            console.log(" If the room doesn't exist, create a new room");
            room = await Room.create({
                RoomId: newRoomId,
                Messages: [],
            });
        }
        console.log("step 4");
        // Create a new message
        console.log(sender, reciever, "message", "image", Image, Name, Number, Date);
        const newMessage = await Message.create({
            RoomId: RoomId,
            Image: Image,
            Name: Name,
            Number: Number,
            date: Date
        });

        console.log("mesg created ", newMessage);

        // Add the new message to the room's Messages array
        room.Messages.push(newMessage._id);

        // Save the updated room
        await room.save();


        const nextuser = await User.findOne({ number: reciever });
        const user = await User.findOne({ number: sender }).populate('Chats').exec();
        // Log the user details for debugging purposes
        const existConnection = user.myconnection.some(connection => connection == reciever);
        const existnextConnection = nextuser.myconnection.some(connection => connection == sender);
        if (!existConnection) {
            user.myconnection.push(reciever);
            await user.save();
        }
        if (!existnextConnection) {
            nextuser.myconnection.push(sender);
            await user.save();
        }
        const exists = user.Chats.some(chat => chat._id.toString() === room._id.toString());
        if (!exists) {
            // Add the room ID to the user's chats
            user.Chats.push(room._id);
            // Save the user document with the updated chats
            await user.save();
            //console.log('Room added to user chats:', room._id);
        } else {
            //console.log('Room already exists in user chats:', room._id);
        }

        return { success: true, message: 'Message added successfully', user };
    } catch (error) {
        console.log('Error in adding image in room', error);
        // Handle any errors during the process
        return { success: false, message: error.message || 'Error adding message to room' };
    }
};
exports.uploadImage = async (req, res) => {
    try {
        console.log("request accepted for image uplaoding", req.files);
        // const { Image} = req.body;
        const Image = req.files.Image;
        console.log(Image);

        // const userImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
        if (req.files && req.files.Image) {
            console.log("ready for upload");
            const data = await uploadImageToCloudinary(req.files.Image, process.env.FOLDER_NAME);
            console.log("done upload");
            return res.status(200).json({ imageLink: data.secure_url, message: 'image uploaded ' });
        }

    } catch (err) {
        console.log("error uploading", err);
        res.status(500).json({ error: 'InternalServerError', message: err.message });
    }
};
