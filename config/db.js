const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

pool.getConnection((err, connection) => {
  if (err) {
    console.log('Gagal terhubung ke database:', err.message);
    return;
  }
  console.log('Database terhubung dengan sukses.');
  connection.release();
});

module.exports = pool.promise();