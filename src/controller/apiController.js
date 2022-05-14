const { findUser } = require("../models/authModel");
const chatModel = require("../models/chatModel");

const getConversations = async (req, res) => {
    const { userId } = req.body;
    const conversations = await chatModel.getConversations(userId);
    res.json({ message: "OK", data: conversations });
};
const getUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await findUser(email, password);
    res.json({ message: "OK", data: user });
};

module.exports = { getConversations, getUser };
