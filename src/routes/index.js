const chatController = require("../controller/chatController");
const { handleLogin, handleRegister, loginWithAccesToken, refreshToken } = require("../controller/authController");

const router = require("express").Router();

router.post("/login", handleLogin);
router.post("/login-with-access-token", loginWithAccesToken);
router.post("/register", handleRegister);
router.post("/refresh-token", refreshToken);

router.get("/api/rooms/:userId", chatController.getRooms);

router.get("/api/messages/:roomId", chatController.getMessages);

module.exports = router;
