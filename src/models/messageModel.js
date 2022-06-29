const pool = require("../configs/databaseConfig");
const { convertMessage } = require('../helper/convertData');


const getAllMessage = async (roomId) => {
    const [messages] = await pool.execute(
        `SELECT message.* , user.avatar, participant.display_name FROM message 
        LEFT JOIN participant ON participant.user_id = message.user_id AND participant.room_id = message.room_id
        LEFT JOIN user ON message.user_id = user.user_id 
        WHERE message.room_id = ?
        ORDER BY created_at ASC`,
        [roomId]
    );

    await pool.execute(
        `UPDATE message 
        SET is_read = 1
        WHERE is_read = 0`
    );

    if (messages.length) {
        return messages.map((message) => convertMessage(message));
    }
    return messages;
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
const getMessage = async (messageId) => {
    const [messages] = await pool.execute(
        `SELECT message.* , user.avatar, participant.display_name FROM message 
        LEFT JOIN participant ON participant.user_id = message.user_id AND participant.room_id = message.room_id
        LEFT JOIN user ON message.user_id = user.user_id 
        WHERE message.message_id = ?`,
        [messageId]
    );

    return convertMessage(messages[0]);
};
const addMessage = async (data) => {
    const { senderId, roomId, messageText } = data;

    const [res] = await pool.execute(
        "INSERT INTO message (user_id, message_text, room_id ) VALUES (?,?,?)",
        [senderId, messageText, roomId]
    );
    return res.insertId;
};



module.exports = {
    getAllMessage,
    getMessage,
    addMessage,
    getLastMessage,
    getUnReadMessage
};
