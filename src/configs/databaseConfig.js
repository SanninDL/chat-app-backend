// get the client
const mysql = require("mysql2/promise");

// create the connection to database
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "chat_app",
    password: "Mr123456"
});

module.exports = pool;
