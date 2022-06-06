const {
    addMessage,
    getRooms,
    createRoom,
    addMemberToGroup
} = require("../models/chatModel");


const createSoketRoom = async (sender, otherMemberIds, conversationName) => {

    const memberIds = [sender, ...otherMemberIds];
    const newRoomId = await createRoom(
        sender,
        memberIds,
        conversationName
    );
    await addMemberToGroup(memberIds, newRoomId);


    return newConversationId;

};

const joinRoom = async (socket, userId, activeUsers) => {
    console.log(userId);
    try {
        activeUsers.set(userId, socket);
        const rooms = await getRooms(userId);
        console.log(rooms);
        for (var room of rooms) {
            socket.join(room);
        }
    } catch (error) {
        console.log(error);
    }
};

const sendMessage = async (socket, activeUsers, payload) => {
    try {
        const createTime = new Date();
        const { sender, otherMemberIds, roomName } = payload;
        const roomId = payload.roomId || createSoketRoom(sender, otherMemberIds, roomName);

        if (!payload.roomId) {
            socket.join(roomId);
            for (var memberId of otherMemberIds) {
                if (activeUsers.has(memberId)) {
                    const memberSocket = activeUsers.get(memberId);
                    memberSocket.join(roomId);

                }
            }
        }

        const data = {
            ...payload,
            createdAt: createTime
        };

        const senderInfo = await addMessage(data);
        socket
            .to(conversationId)
            .emit("receive_message", { ...data, ...senderInfo });
    } catch (error) {
        console.log(error);
    }

};

module.exports = { sendMessage, joinRoom, createSoketRoom };
