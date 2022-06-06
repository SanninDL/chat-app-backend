const { sendMessage, joinRoom } = require("./socketAction");

const activeUsers = new Map();

const initSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_chat", (userId) => {
            joinRoom(socket, userId);
        });
        socket.on("send_message", (payload) =>
            sendMessage(socket, activeUsers, payload)
        );
        socket.on('disconnect', () => {
            console.log('user disconnected');

        });
    });
};

module.exports = initSocket;
