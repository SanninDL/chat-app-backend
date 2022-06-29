const pool = require("../configs/databaseConfig");
const { getUnReadMessage, getLastMessage } = require('./messageModel');


const getRooms = async (userId) => {
    const [rooms] = await pool.execute(
        `SELECT * FROM room 
        LEFT JOIN participant ON room.room_id = participant.room_id 
        WHERE participant.user_id = ?
        `, [userId]
    );
    const roomResult = [];
    if (rooms.length) {
        for (var room of rooms) {
            const lastMessage = await getLastMessage(room.room_id);
            const unReadMessages = await getUnReadMessage(room.room_id);
            roomResult.push({
                ...room,
                lastMessage: lastMessage,
                unReadMessages: unReadMessages
            });
        }
    }
    return roomResult;
};
const createRoom = async (adminId, roomName, roomAvatar) => {
    try {
        const [res] = await pool.execute(
            "INSERT INTO room (admin_id, room_name, room_avatar) VALUES (?)",
            [adminId, roomName, roomAvatar]
        );
        return res.insertId;
    } catch (error) {
        console.log(error);
    }
};
const addMemberToGroup = async (userIds, roomId) => {
    try {
        for (var userId of userIds) {
            await pool.execute(
                "INSERT INTO participant (user_id, room_id) ",
                [userId, roomId]
            );
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getRooms,
    createRoom,
    addMemberToGroup
};
