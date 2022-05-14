
const jwt = require("jsonwebtoken");
require("dotenv").config();

const refreshTokenList = []

const createAccessToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: `${process.env.ACCESS_TOKEN_LIFE}` });

    return token;
};
const createRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: `${process.env.REFRESH_TOKEN_LIFE}` });
    refreshTokenList.push(token)
    return token;
}


module.exports = { createAccessToken, createRefreshToken, refreshTokenList };
