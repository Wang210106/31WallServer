// postModel.js
const pool = require('../config/db')
 
//post表
// create table posts(
// post_id int auto_increment primary key,
// title varchar(255) not null,
// user_id int,
// content text,
// images text,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// foreign key (user_id) references users(id) ON DELETE CASCADE
// );

function createPost(post, callback){
    const { userid, title, content, images } = post; 
    const query = 'INSERT INTO posts (user_id, title, content, images, created_at) VALUES (?, ?, ?, ?, NOW())';

    pool.query(query, [ userid, title, content, JSON.stringify(images) ],(err, result, fields) => {
      try{
        callback(null, { message: "post created success" })
      }
      catch{
        callback(true, { message: 'requires lacking or other error' })
      }
    })
}

function getPostsList(callback){
  pool.query('SELECT * FROM posts', (err, result, fields) => {
    console.log(err,result)
    callback(null, result);
  });
}

function deletePost(postId, callback) {
  const query = 'DELETE FROM posts WHERE post_id = ?';
 
  pool.query(query, [postId], (err, result) => {
    try{
      if (result.affectedRows === 0) {
        return callback(new Error('No post found with that ID'));
      }
  
      callback(null, { message: 'Post deleted successfully', deletedPostId: postId });
    }
    catch{
      callback(true, new Error('No post found with that ID'))
    }
  });
}

function findPostsByUserId(userId, callback) {
  const query = 'SELECT * FROM posts WHERE user_id = ?';

  pool.query(query, [userId], (err, result) => {
    try{
      callback(null, result)
    }
    catch{
      callback(true, { message: 'err,not found' })
    }
  });
}

function findPostByPostId(userId, callback) {
  const query = 'SELECT * FROM posts WHERE post_id = ?';

  pool.query(query, [userId], (err, result) => {
    try{
      callback(null, result)
    }
    catch{
      callback(true, { message: 'not found' })
    }
  });
}

function search(keyWord, callback) {
  const query = 'SELECT * FROM posts WHERE title LIKE ? OR content LIkE ?'
  const key = `%${keyWord}%`

  pool.query(query, [ key, key ], (err, result) => {
    if (err)
      return callback(true,null)

    callback(null, { result })
  })
}

module.exports = {
    createPost,
    getPostsList,
    deletePost,
    findPostsByUserId,
    findPostByPostId,
    search
}
