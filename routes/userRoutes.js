const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
// 获取用户列表的路由
router.get('/users', userController.getUserList);
 
// 创建新用户的路由
router.post('/users', userController.createUser);
 
module.exports = router;