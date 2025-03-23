const express = require('express');
const app = express();

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const reportController = require('./controllers/reportController');
const commentController = require('./controllers/commentController');

 
app.use(express.json());
 
// 挂载路由
app.use('/user', userController); 
app.use('/post', postController);
app.use('/report', reportController);
app.use('/comment', commentController);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});