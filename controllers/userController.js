// userController.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 
 
//創建用戶
router.post('/', (req, res) => {
  const newUser = { ...req.body, openid: req.headers['x-wx-openid'] }; 

  let hasSigned = false

  userModel.getUserByOpenId(newUser.openid, (err, result) => {
    if (err || result.message == "not found") {
      hasSigned = result
    }
  })

  if (hasSigned){
    return res.status(500).json({ message: 'Has Signed' , info: hasSigned});
  }

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
  const openid = req.query.openid || req.headers['x-wx-openid'];
  
  userModel.getUserByOpenId(openid, (err, result) => {
    if (err){
      return res.status(404).json({ message: "User not Found!" })
    }

    res.json(result)
  })
})

//findByUserid
router.get("/userid", (req, res) => {
  const userid = req.query.userid;
  
  userModel.getUserByUserId(userid, (err, result) => {
    if (err){
      return res.status(404).json({ message: "User not Found!" })
    }

    res.json(result)
  })
})

//findByRealname
router.get("/realname", (req, res) => {
  const realname = req.query.realname;
  
  userModel.getUserByOpenId(realname, (err, result) => {
    if (err){
      return res.status(404).json({ message: "User not Found!" })
    }

    res.json(result)
  })
})

//findByClass
router.get("/class", (req, res) => {
const info = {
  class: req.body.class,
  grade: req.body.grade,
}

  userModel.getUserByOpenId(info, (err, result) => {
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
  const info = { ...req.body , openid: req.headers['x-wx-openid'] }
  userModel.updateUser(info, (error, result) => {
    if (error)
      return res.status(401).json({ error });

    res.json(result)
  })
})

//刪除用戶
router.delete('/', (req, res) => {
  const openid = req.query.openid;

  userModel.deleteUser(openid, (err, result) => {
    if (err) {
      return res.status(400).json({ message: 'Can\'nt delete' });
    }

    res.json(result)
  })
})
 
module.exports = router;