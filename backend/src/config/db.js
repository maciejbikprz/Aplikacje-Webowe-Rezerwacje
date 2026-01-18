const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DEBUG ENV:', process.env.DB_HOST, process.env.DB_DATABASE);

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "user",
  password: "password",
  database: "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;