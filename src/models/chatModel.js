const pool = require("../configs/databaseConfig");

const getAllMessage = async (data) => {
    const { conversationId } = data;
    try {
        const [messages] = await pool.execute(
            "SELECT * FROM messages WHERE conversationId = ?",
            [conversationId]
        );
        return messages;
    } catch (error) {}
};
const addMessage = async (data) => {
    const { sender, message_text, created_at, conversation_id } = data;

    try {
        await pool.execute(
            "INSERT INTO messages (sender, messageText, createdAt, conversationId ) VALUES (?,?,?,?)",
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
const getConversations = async (userId) => {
    const [result] = await pool.execute(
        "SELECT conversationId FROM group_member WHERE memberId = ?",
        [userId]
    );
    return result;
};
const createConversation = async (sender, memberIds, conversationName) => {
    try {
        const memberName = await pool.execute(
            "SELECT displayName FROM users WHERE id = ?",
            [memberIds[0]]
        );
        const createName = conversationName || memberName;

        const [res] = await pool.execute(
            "INSERT INTO conversations ( name) VALUES (?)",
            [createName]
        );
        return res.insertId;
    } catch (error) {
        console.log(error);
    }
};
const addMemberToGroup = async (userIds, conversationId) => {
    try {
        for (var userId of userIds) {
            await pool.execute(
                "INSERT INTO groupMember (memberId, conversationId) ",
                [userId, conversationId]
            );
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllMessage,
    addMessage,
    getConversations,
    createConversation,
    addMemberToGroup
};
