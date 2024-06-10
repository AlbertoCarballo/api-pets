const mysql2 = require('mysql2/promise');
require('dotenv').config();

const connection = mysql2.createPool({
    host: process.env.MYSQLHOST, 
    user: process.env.MYSQLUSER,
    port: process.env.MYSQLPORT, 
    password: process.env.MYSQLPASSWORD, 
    database: process.env.MYSQLDATABASE,
});

module.exports =connection;