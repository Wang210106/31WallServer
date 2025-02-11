// userModel.js
const pool = require('../config/db')
 
//users表
// CREATE TABLE IF NOT EXISTS users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   openid VARCHAR(255) UNIQUE NOT NULL,
//   nickname VARCHAR(255),
//   avatar_url VARCHAR(255),
//   gender TINYINT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// )
 
function getUserList(callback) {
  pool.query('SELECT * FROM users', (error, results, fields) => {
    if (error) throw error;
    callback(null, results);
  });
}
 
function getUserByOpenId(openid, callback) {
  pool.query('SELECT * FROM users WHERE openid = ?', [openid], (error, results, fields) => {
    try{
      callback(null, results.length > 0 ? results[0] : { message: "not found" });
    }
    catch{
      callback(true, -1);
    }
  });
}

function createUser(user, callback) {
  const { openid, nickname, avatar_url, gender } = user;
  const query = 'INSERT INTO users (openid, nickname, avatar_url, gender, created_at) VALUES (?, ?, ?, ?, NOW())';
  pool.query(query, [openid, nickname, avatar_url, gender], (error, results, fields) => {
    try{
      callback(null, results.insertId); // 返回插入的ID
    }
    catch{
      callback(true, -1);
    }
  });
}

function deleteUser(openid, callback){
  const query = 'DELETE FROM users WHERE openid = ?'

  pool.query(query, [openid], (error, result, fields) => {
    callback(error, result)
  })
}

module.exports = {
  getUserList,
  getUserByOpenId,
  createUser,
  deleteUser,
};