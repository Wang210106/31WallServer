// userModel.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
 
const pool = mysql.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,   
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,  
});
 
function getUserList(callback) {
  pool.query('SELECT * FROM users', (error, results, fields) => {
    if (error) throw error;
    callback(null, results);
  });
}
 
function getUserByOpenId(openid, callback) {
  pool.query('SELECT * FROM users WHERE openid = ?', [openid], (error, results, fields) => {
    if (error) throw error;
    callback(null, results.length > 0 ? results[0] : null);
  });
}

function createUser(user, callback) {
  const { openid, nickname, avatar_url, gender } = user;
  const query = 'INSERT INTO users (openid, nickname, avatar_url, gender, created_at) VALUES (?, ?, ?, ?, NOW())';
  pool.query(query, [openid, nickname, avatar_url, gender], (error, results, fields) => {
    if (error) throw error;
    callback(null, results.insertId); // 返回插入的ID
  });
}
 
// 更新用户信息的函数
function updateUser(user, callback) {
  const { openid, nickname, avatar_url, gender } = user;
  const query = 'UPDATE users SET nickname = ?, avatar_url = ?, gender = ? WHERE openid = ?';
  pool.query(query, [nickname, avatar_url, gender, openid], (error, results, fields) => {
    if (error) throw error;
    callback(null, results); 
  });
}
 
function closePool() {
  pool.end((error) => {
    if (error) throw error;
    console.log('Database connection pool closed.');
  });
}
 
module.exports = {
  getUserList,
  getUserByOpenId,
  createUser,
  updateUser,
  closePool 
};