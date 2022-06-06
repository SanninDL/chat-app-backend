const jwt = require("jsonwebtoken");

const { convertUser } = require('../helper/convertData');
const { createAccessToken, createRefreshToken } = require("../middleware/JwtAction");
const { findUser, createUser, checkExist, findUserWithId } = require("../models/authModel");


const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUser(email, password);
        if (user) {
            const accessToken = createAccessToken({ userId: user.user_id });
            const refreshToken = createRefreshToken({ userId: user.user_id });
            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: "/",
            //     sameSite: "strict",
            // });
            const userData = convertUser(user);
            res.json({
                isSuccess: true,
                data: {
                    accessToken,
                    refreshToken,
                    user: userData
                }

            });
        } else {
            res.json({ isSuccess: false, data: null });
        }
    } catch (error) {
        console.log(error);
    }
};
const loginWithAccesToken = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await findUserWithId(userId);

        if (user) {
            res.json({
                isSuccess: true,
                data: {
                    user: convertUser(user)
                }
            });
        }
    } catch (error) {

    }

};
const handleRegister = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const isExist = checkExist(email);
        if (!isExist) {
            const id = await createUser(userName, email, password);
            const accessToken = createToken({ userId: id });
            const freshToken = createRefreshToken({ userId: id });

            res.cookie("refreshToken", freshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.json({
                message: "register success",
                isSucces: true,
                data: {
                    accessToken: accessToken
                }
            });
        } else {
            res.json({
                isSucces: false,
                message: 'email already exists'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};
const refreshToken = (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json("You're not authenticated");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, function (err, { userId }) {
        if (err) {
            return res.status(403).json("Refresh token is not valid");
        }

        const newAccessToken = createAccessToken({ userId: userId });
        const newRefreshToken = createRefreshToken({ userId: userId });
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });


    });

};
module.exports = { handleLogin, handleRegister, refreshToken, loginWithAccesToken };
