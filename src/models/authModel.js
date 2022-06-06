const pool = require("../configs/databaseConfig");

const findUser = async (email, password) => {
    try {
        const [user] = await pool.execute(
            "SELECT * FROM user WHERE email = ? AND password = ?",
            [email, password]
        );
        return user[0];
    } catch (e) {
        console.log('error ', e);
    }
};
const findUserWithId = async (userId) => {
    try {
        const [user] = await pool.execute("SELECT * FROM user WHERE user_id = ?",
            [userId]);
        return user[0];
    } catch (e) {
        console.log('error', e);
    }
};
const createUser = async (userName, email, password) => {
    try {
        if (userName && email && password) {
            const [result] = await pool.execute(
                "INSERT INTO user (userName, email, password) VALUES (?, ?, ?)  ",
                [userName, email, password]
            );
            return result.insertId;
        } else {
            console.log("chua du thong tin");
        }
    } catch (error) {
        console.log(error);
    }
};
const deleteUser = async (data) => {
    const { id } = data;
    try {
        await pool.execute("DELETE FROM user WHERE user_id = ?", [id]);
    } catch (error) {
        console.log(error);
    }
};

const checkExist = async (email) => {
    const [users] = await pool.execute(
        "SELECT * FROM user WHERE email = ?",
        [email]
    );
    return users.length > 0 ? false : true;
};

module.exports = { findUser, createUser, deleteUser, checkExist, findUserWithId };
