const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createPool(process.env.DATABASE_URL);


pool.getConnection((err, connection) => {
  if (err) {
    console.log('Gagal terhubung ke database:', err.message);
    return;
  }
  console.log('Database terhubung dengan sukses.');
  connection.release();
});

module.exports = pool.promise();