
const { convertRoomList } = require('../helper/convertData');
const { findUser } = require("../models/authModel");
const chatModel = require("../models/chatModel");

const getRooms = async (req, res) => {
    const { userId } = req.params;
    const rooms = await chatModel.getRooms(userId);


    res.json({
        isSuccess: true,
        msg: "Ok",
        data: { rooms: convertRoomList(rooms) }
    });
};


const getMessages = async (req, res) => {
    const roomId = req.body.roomId;
    const messages = await chatModel.getAllMessage(roomId);
    console.log('mes ', messages);
    res.json({ message: "OK", data: messages });
};

module.exports = { getRooms, getMessages };
