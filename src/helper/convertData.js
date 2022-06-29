
const convertUser = (user) => {
    return {
        userName: user.user_name,
        avatar: user.avatar,
        email: user.email,
        userId: user.user_id
    };
};
const convertMessage = (message) => {
    return {
        messageId: message.message_id,
        roomId: message.room_id,
        messageText: message.message_text,
        createdAt: message.created_at,
        isRead: message.is_read,
        sender: {
            userId: message.user_id,
            avatar: message.avatar,
            displayName: message.display_name
        }
    };
};
const convertRoom = (room) => {
    return {
        roomId: room.room_id,
        roomName: room.room_name,
        adminId: room.admin_id,
        createdAt: room.created_at,
        roomAvatar: room.room_avatar,
        lastMessage: room.lastMessage,
        unReadMessages: room.unReadMessages
    };
};
const convertRoomList = (roomList) => {
    return roomList.map((room) => convertRoom(room));
};


module.exports = { convertRoom, convertRoomList, convertUser, convertMessage };