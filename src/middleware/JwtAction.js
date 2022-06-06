
const jwt = require("jsonwebtoken");
require("dotenv").config();


const createAccessToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: `${process.env.ACCESS_TOKEN_LIFE}` });

    return token;
};
const createRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: `${process.env.REFRESH_TOKEN_LIFE}` });

    return token;
};

const checkAccessToken = (req, res, next) => {
    if (req.url === '/login' || req.url === '/refresh-token') {
        return next();
    }

    const accessToken = req.headers['x-access-token'];
    console.log('check access token...');

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.message === 'jwt expired') {
                return res.status(401).json("Access token expired");
            } else {
                return res.status(403).json("Access token is not valid");
            }
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = { createAccessToken, createRefreshToken, checkAccessToken };
