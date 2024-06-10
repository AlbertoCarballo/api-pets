const mysql2 = require('mysql2/promise');
require('dotenv').config();

const connection = mysql2.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    port: process.env.DB_PORT, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE,
});

module.exports =connection;