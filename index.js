const express = require('express');
const app = express();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
 
app.use(express.json());
 
// 挂载路由
app.use('/user', userController); 
app.use('/post', postController);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});