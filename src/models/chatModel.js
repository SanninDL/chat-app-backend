const pool = require("../configs/databaseConfig");
const { convertMessage } = require('../helper/convertData');




const getAllMessage = async (roomId) => {

    try {
        const [messages] = await pool.execute(
            "SELECT * FROM message WHERE room_id = ?",
            [roomId]
        );
        return messages;
    } catch (error) {
        console.log(error);
    }
};
const getUnReadMessage = async (roomId) => {
    const [messages] = await pool.execute(
        "SELECT * FROM message WHERE room_id = ? AND message.is_read = 0 ORDER BY created_at DESC", [roomId]
    );
    return messages.map((message) => convertMessage(message));
};
const getLastMessage = async (roomId) => {
    const [messages] = await pool.execute("SELECT * FROM message WHERE room_id = ? ORDER BY created_at DESC LIMIT 1", [roomId]);
    return convertMessage(messages[0]);
};
const addMessage = async (data) => {
    const { sender, message_text, created_at, conversation_id } = data;

    try {
        await pool.execute(
            "INSERT INTO message (sender, messageText, createdAt, conversationId ) VALUES (?,?,?,?)",
            [sender, message_text, created_at, conversation_id]
        );
        const [user] = await pool.execute(
            "SELECT displayName, avatar FROM users WHERE id = ?",
            [sender]
        );

        return user[0];
    } catch (error) {
        console.log(error);
    }
};
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
const createRoom = async (sender, memberIds, conversationName) => {
    try {
        const memberName = await pool.execute(
            "SELECT user_name FROM user WHERE user_id = ?",
            [memberIds[0]]
        );
        const createName = conversationName || memberName;

        const [res] = await pool.execute(
            "INSERT INTO room (room_name) VALUES (?)",
            [createName]
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
                "INSERT INTO participant (user_id,  room_id) ",
                [userId, roomId]
            );
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllMessage,
    addMessage,
    getRooms,
    createRoom,
    addMemberToGroup
};
