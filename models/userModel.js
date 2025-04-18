// userModel.js
const pool = require('../config/db')
 
//users表
// CREATE TABLE IF NOT EXISTS users (
//   userid INT AUTO_INCREMENT PRIMARY KEY,
//   openid VARCHAR(255) UNIQUE NOT NULL,
//   realname VARCHAR(255),
//   nickname VARCHAR(255),
//   grade INT,
//   class INT,
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
    if (error)
      return callback(true, error)

    callback(null, results.length > 0 ? results[0] : { message: "not found" });
  });
}

function getUserByUserId(userid, callback) {
  pool.query('SELECT * FROM users WHERE userid = ?', [userid], (error, results, fields) => {
    if (error)
      return callback(true, error)

    callback(null, results.length > 0 ? results[0] : { message: "not found" });
  });
}

function getUserByRealname(name , callback) {
  pool.query('SELECT * FROM users WHERE realname = ?', [ name ], (error, results, fields) => {
    if (error)
      return callback(true, error)

    callback(null, results.length > 0 ? results[0] : { message: "not found" });
  });
}

function getUserByClass(info , callback) {
  pool.query('SELECT * FROM users WHERE class = ? AND grade = ?', [ info.class, info.class ], (error, results, fields) => {
    if (error)
      return callback(true, error)

    callback(null, results.length > 0 ? results[0] : { message: "not found" });
  });
}

function createUser(user, callback) {
  const query = `INSERT INTO users 
          (openid, realname, nickname, avatar_url, gender, class, grade, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  pool.query(query, 
    [user.openid, user.realname, user.nickname, user.avatar_url, user.gender, user.class, user.grade]
    , (error, results, fields) => {
    try{
      callback(null, results.insertId); // 返回插入的ID
    }
    catch{
      callback(true, -1);
    }
  });
}

function updateUser(info, callback) {
  const { openid } = info;
  delete info.openid;
 
  const setClauses = Object.entries(info).map(([key, value]) => {
    const escapedValue = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
    return `${key} = ${escapedValue}`;
  });
  const setClause = setClauses.join(', ');
 
  const query = `UPDATE users SET ${setClause} WHERE openid = ?`;

  pool.query(query, [openid], (error, results, fields) => {

    if (error) {
      return callback(error);
    }

    callback(null, results);
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
  updateUser,
  deleteUser,
  getUserByClass,
  getUserByRealname,
  getUserByUserId
};