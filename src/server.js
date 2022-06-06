const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var morgan = require('morgan');


const router = require("./routes");
const initSocket = require("./socket");
const { checkAccessToken } = require('./middleware/JwtAction');
//


const app = express();
const httpServer = createServer(app);

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan(' ==== :method :url :status'));

app.use(checkAccessToken);

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

initSocket(io);

app.use(router);
