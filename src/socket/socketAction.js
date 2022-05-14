const {
    addMessage,
    getConversations,
    createConversation,
    addMemberToGroup
} = require("../models/chatModel");


const createSoketConversation = async (sender, otherMemberIds, conversationName) => {

    const memberIds = [sender, ...otherMemberIds];
    const newConversationId = await createConversation(
        sender,
        memberIds,
        conversationName
    );
    await addMemberToGroup(memberIds, newConversationId);


    return newConversationId

}

const joinRoom = async (socket, userId, activeUsers) => {
    console.log(userId);
    try {
        activeUsers.set(userId, socket);
        const conversations = await getConversations(userId);
        console.log(conversations);
        for (var conversation of conversations) {
            socket.join(conversation);
        }
    } catch (error) {
        console.log(error);
    }
};

const sendMessage = async (socket, activeUsers, payload) => {
    try {
        const createTime = new Date();
        const { sender, otherMemberIds, conversationName } = payload
        const conversationId = payload.conversationId || createSoketConversation(sender, otherMemberIds, conversationName)

        if (!payload.conversationId) {
            socket.join(conversationId)
            for (var memberId of otherMemberIds) {
                if (activeUsers.has(memberId)) {
                    const memberSocket = activeUsers.get(memberId)
                    memberSocket.join(conversationId)

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

module.exports = { sendMessage, joinRoom };
