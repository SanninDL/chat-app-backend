const { convertUser, convertMessage } = require('../helper/convertData');
const { findUserWithId } = require('../models/authModel');
const messageModel = require("../models/messageModel");
const roomModel = require('../models/roomModel');

const createSoketRoom = async (payload) => {
    const { adminId, otherMemberIds, roomName, roomAvatar } = payload;
    const memberIds = [senderId, ...otherMemberIds];

    const newRoomId = await roomModel.createRoom(
        adminId,
        roomName,
        roomAvatar
    );

    await roomModel.addMemberToGroup(memberIds, newRoomId);

    return newRoomId;
};

const joinRoom = async (socket, userId) => {
    try {
        const rooms = await roomModel.getRooms(userId);
        for (var room of rooms) {
            socket.join(room.room_id);
        }
    } catch (error) {
        console.log(error);
    }
};

const sendMessage = async (payload, io) => {
    console.log("🚀 ~ payload", payload);
    try {
        const { senderId, roomId } = payload;

        const newMessageId = await messageModel.addMessage(payload);

        const newMessage = await messageModel.getMessage(newMessageId);

        io
            .to(roomId)
            .emit("message", { ...newMessage });
        // .emit("message", { ...payload, sender: convertUser(sender) });
    } catch (error) {
        console.log(error);
    }

};



module.exports = { sendMessage, joinRoom, createSoketRoom };
