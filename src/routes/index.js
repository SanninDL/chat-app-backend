const { getConversations, getUser } = require("../controller/apiController");
const { handleLogin, handleRegister } = require("../controller/authController");


const router = require("express").Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);

router.post("/api/conversations", getConversations);
router.post("/api/user", getUser);



module.exports = router;
