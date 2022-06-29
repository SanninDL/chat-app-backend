
const { convertRoomList } = require('../helper/convertData');
const messageModel = require('../models/messageModel');
const roomModel = require('../models/roomModel');

const getRooms = async (req, res) => {
    const { userId } = req.params;
    const rooms = await roomModel.getRooms(userId);


    res.json({
        isSuccess: true,
        msg: "Ok",
        data: { rooms: convertRoomList(rooms) }
    });
};


const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await messageModel.getAllMessage(roomId);
        res.json({
            isSuccess: true,
            msg: "OK",
            data: {
                messages: messages
            }
        });
    } catch (error) {
        res.json({
            isSuccess: false,
            msg: error.message,
            data: null
        });
    }

};

module.exports = { getRooms, getMessages };
