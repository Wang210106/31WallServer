const userModel = require('../models/userModel'); 
 
const userController = {
  // 获取用户列表
  getUsers: async (req, res) => {
    try {
      const users = await userModel.getUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
 
  // 创建新用户
  createUser: async (req, res) => {
    try {
      const { openid, nickname, avatarUrl, gender } = req.body;
 
      const newUser = await userModel.createUser(openid, nickname, avatarUrl, gender);
 
      // 返回新创建的用户的ID
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Bad Request' });
    }
  },
};
 
module.exports = userController;