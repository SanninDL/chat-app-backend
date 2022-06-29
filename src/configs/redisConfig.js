const redis = require('redis');

const activeUsers = redis.createClient({
    host: 'http://localhost',
    port: '8000',
    db: 1
});
const redisClient = redis.createClient({
    host: 'http://localhost',
    port: '8000',
    db: 2
});

redisClient.connect();
activeUsers.connect();

module.exports = {
    activeUsers,
    redisClient
};