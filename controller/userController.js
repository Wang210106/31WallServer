const User = require('../models/userModel'); 
 
// 获取用户列表
exports.getUserList = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
// 创建新用户
exports.createUser = async (req, res) => {
    const newUser = new User(req.body); 
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};