const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

//

const router = require("./routes");
const initSocket = require("./socket");

const app = express();
const httpServer = createServer(app);

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true
    }
});
const port = process.env.PORT || 8000;


httpServer.listen(port, () => {
    console.log("app is running at port ", port);
});

// initSocket(io);

app.use(router);
