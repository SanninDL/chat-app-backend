
const jwt = require("jsonwebtoken");
const redis = require('redis');
const { redisClient } = require('../configs/redisConfig');
require("dotenv").config();

// const redisClient = redis.createClient();

// redisClient.connect();


const createAccessToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: `${process.env.ACCESS_TOKEN_LIFE}` });
    return token;
};
const createRefreshToken = async (data) => {
    const token = jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: `${process.env.REFRESH_TOKEN_LIFE}` });

    await redisClient.set(`${data.userId}`, token);

    return token;
};

const checkAccessToken = (req, res, next) => {
    if (req.url === '/login' || req.url === '/refresh-token' || req.url === '/test') {
        return next();
    }

    const accessToken = req.headers['x-access-token'];
    console.log('check access token... ', accessToken);

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('invalid');

            if (err.message === 'jwt expired') {
                return res.status(401).json("Access token expired");
            } else {
                return res.status(403).json("Access token is not valid");
            }

        }
        req.userId = decoded.userId;
        console.log('valid token');
        next();
    });
};
const checkRefreshToken = async (refreshToken) => {
    try {
        const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const tokenInRedis = await redisClient.get(`${userId}`);

        if (tokenInRedis && tokenInRedis === refreshToken) {
            console.log('tokenInRedis ', tokenInRedis);
            return userId;
        } else {
            return null;
        }

    } catch (error) {
        console.log('check refresh token error ', error.message);
        return null;
    }
};

module.exports = { createAccessToken, createRefreshToken, checkAccessToken, checkRefreshToken };
