// userController.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 
 
router.post('/user', (req, res) => {
  //检验是否存在
    const openid = req.body.openid;
    userModel.getUserByOpenId(openid, (error, user) => {
      if (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        //不存在那么新建用户
        const newUser = req.body; 
    
        userModel.createUser(newUser, (error, userId) => {
          if (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          console.log(newUser)
          return res.status(200).json({ id: userId, message: 'User Created Successfully' });
        });
      }
      else{
        const updatedUser = req.body; 

        userModel.updateUser({ ...updatedUser }, (error, results) => {
          if (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
          }
          if (!results.affectedRows > 0) {
            return res.status(404).json({ message: 'User Not Found or Update Failed' });
          }
          console.log(user)
          res.json({ message: 'User Updated Successfully' , id: user.id });
        });
      }
    });
})

// 获取用户列表的路由
router.get('/users/all', (req, res) => {
  userModel.getUserList((error, users) => {
    if (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(users);
  });
});
 
module.exports = router;