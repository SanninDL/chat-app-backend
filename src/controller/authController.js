const { createAccessToken, createRefreshToken, refreshTokenList } = require("../middleware/JwtAction");
const { findUser, createUser, checkExist } = require("../models/authModel");



const handleLogin = async (req, res) => {
    console.log('login ', req.body)

    const { email, password } = req.body;
    try {
        const user = await findUser(email, password);
        if (user) {
            const accessToken = createAccessToken({ id: user.id })
            const freshToken = createRefreshToken({ id: user.id })
            res.cookie("refreshToken", freshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.json({
                isSucces: true,
                data: {
                    accessToken: accessToken
                }

            });
        } else {
            res.json({ isSucces: false });
        }
    } catch (error) {
        console.log(error);
    }
};
const handleRegister = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const isExist = checkExist(email)
        if (!isExist) {
            const id = await createUser(userName, email, password);
            const accessToken = createToken({ id: user.id })
            const freshToken = createRefreshToken({ id: id })

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
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500)
    }
};
const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(401).json("You're not authenticated")
    }
    if (!refreshTokenList.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, function (err, userId) {
        if (err) {
            console.log(err)
            return res.status(403).json("Refresh token is not valid");
        }
        refreshTokenList = refreshTokenList.filter(token => token !== refreshToken)

        const newAccessToken = createAccessToken({ id: userId })
        const newRefreshToken = createRefreshToken({ id: userId })

        refreshTokenList.push(newRefreshToken)

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        res.status(200).json({
            accessToken: newAccessToken
        })


    })


}
module.exports = { handleLogin, handleRegister, refreshToken };
