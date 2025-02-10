const pool = require('../config/db');

const userModel = {
  // 创建用户表（初始化时使用）
  createTable: async () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openid VARCHAR(255) UNIQUE NOT NULL,
        nickname VARCHAR(255),
        avatar_url VARCHAR(255),
        gender TINYINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(sql);
  },
  createUser: async (openid, nickname, avatarUrl, gender) => {
    const sql = 'INSERT INTO users (openid, nickname, avatar_url, gender) VALUES (?, ?, ?, ?)';
    const values = [openid, nickname, avatarUrl, gender];
    try {
      const [results, fields] = await pool.query(sql, values);

      const lastInsertId = results.insertId;
      return { id: lastInsertId };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // 获取用户列表
  getUsers: async () => {
    const sql = 'SELECT * FROM users';
    try {
      const [rows, fields] = await pool.query(sql);
      return rows; // 用户列表
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error; 
    }
  },
};

module.exports = userModel;