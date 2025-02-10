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
};

module.exports = userModel;