// userController.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 
 
//創建用戶
router.post('/', (req, res) => {
  const newUser = req.body; 

  userModel.createUser(newUser, (error, userId) => {
    if (error) {
      return res.status(500).json({ message: 'Can\'t create user!' });
    }

    console.log(newUser)
    return res.json({ id: userId, message: 'User Created Successfully' });
  });
})

//findByOpenid
router.get("/", (req, res) => {
  const openid = parseInt(req.query.openid, 10);
  
  userModel.getUserByOpenId(openid, (err, result) => {
    if (err){
      return res.status(404).json({ message: "User not Found!" })
    }

    res.json(result)
  })
})

// 获取用户列表的路由
router.get('/all', (req, res) => {
  userModel.getUserList((error, users) => {
    if (error) {
      return res.status(500).json({ message: 'Internal Server Error caused by YOU' });
    }
    res.json(users);
  });
});

//更改
router.post('/update', (req, res) => {
  const info = {
    id : req.body.id,
    nickname : req.body.nickname,
    openid : req.body.openid,
    avatar_url : req.body.avatar_url,
    gender : req.body.gender,
  }

  userModel.updataUser(info, (error, result) => {
    if (error)
      return res.status(401).json({ error });

    res.json(result)
  })
})

//刪除用戶
router.delete('/', (req, res) => {
  const openid = parseInt(req.query.openid, 10);

  userModel.deleteUser(openid, (err, result) => {
    if (err) {
      return res.status(400).json({ message: 'Can\'nt delete' });
    }

    res.json(result)
  })
})
 
module.exports = router;