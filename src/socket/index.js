const { activeUsers } = require('../configs/redisConfig');
const { sendMessage, joinRoom, createSoketRoom } = require("./socketAction");
// const redis = require('redis');

// const activeUsers = redis.createClient({
//     host: 'http://localhost',
//     port: '8000',
//     db: 1
// })

// activeUsers.connect()

const initSocket = (io) => {
    io.on("connection", async (socket) => {
        console.log('socket connect ', socket.id);
        const userId = socket.handshake.query.userId || 100;
        await joinRoom(socket, userId);

        await activeUsers.set(`${userId}`, socket.id);


        socket.on("message", (payload) => sendMessage(payload, io));
        socket.on("create_room", createSoketRoom);

        socket.on('disconnect', () => {
            console.log('user disconnected', userId);
            activeUsers.del(`${userId}`);

        });


        // test
        // socket.on("test",async ()=> {
        //     const userId = 5
        //     await activeUsers.set(`${userId}`, 'abc');
        // })
        // socket.on("get", async ()=> {
        //     const userId = 5
        //     const a = await activeUsers.get(`${userId}`)
        //     console.log('a ',a)
        // })
    });
};

module.exports = initSocket;
