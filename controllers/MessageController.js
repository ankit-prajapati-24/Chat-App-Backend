const Message = require('../models/MessageSchema');
const User = require('../models/User');
const Room = require('../models/RoomChat');
require("dotenv").config();
exports.getChats = async (req, res) => {

    try {
        const { Number } = req.body;
        const chats = await User.find({ Number: Number }).populate("Chats").exec();
        console.log(chats);
        res.send.status(200).json({
            chats: chats,
        })
    }
    catch (err) {
        console.error(err);
        res.send(err);
    }
}

exports.addMessageInRoom = async (RoomId, MessageText, Name, Number) => {
    try {
        // Find the room by RoomId
        let room = await Room.findOne({ RoomId: RoomId });

        if (!room) {
            // If the room doesn't exist, create a new room
            room = await Room.create({
                RoomId,
                Messages: [],
            });
        }
        // Create a new message
        const newMessage = await Message.create({
            RoomId,
            MessageText: MessageText,
            Name,
            Number,
            timestamp: Date.now(),
        });

        // Add the new message to the room's Messages array
        room.Messages.push(newMessage._id);

        // Save the updated room
        await room.save();


        const user = await User.findOne({ Number: Number }).populate('Chats').exec();

        // Log the user details for debugging purposes
        console.log(user);

        // Check if the room ID is not already in the user's chats
        if (!user.Chats.includes(room._id)) {
            // Add the room ID to the user's chats
            user.Chats.push(room._id);

            // Save the user document with the updated chats
            await user.save();

            console.log('Room added to user chats:', room._id);
        } else {
            console.log('Room already exists in user chats:', room._id);
        }
        return { success: true, message: 'Message added successfully', user };
    } catch (error) {
        // Handle any errors during the process
        return { success: false, message: error.message || 'Error adding message to room' };
    }
};
