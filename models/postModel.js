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

function createPost(post, callback) {
  const { userid, title, content, images, realname, tab } = post;
  const query = 'INSERT INTO posts (user_id, title, content, images, realname, tab, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())';

  pool.query(query, [userid, title, content, JSON.stringify(images), realname, tab], (err, result, fields) => {
      if (err) {
          return callback(new Error('Database query failed or input data is invalid'));
      }
      callback(null, { message: "Post created successfully", result });
  });
}

const chunkSize = 20;

function getPostsList(page, callback){
  pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT ?', [ (page + 1) * chunkSize ], (err, result, fields) => {
    callback(null, result);

    const newPosts = result.data.map(ele => {
      let likeAmount, commentAmount, userInfo;

      pool.query('SELECT COUNT(*) FROM likes WHERE post_id = ?', [ ele.post_id ], (err, result, fields) => {
        console.log('like',result)
        likeAmount = result.likeCount
      })

      pool.query('SELECT COUNT(*) FROM comments WHERE post_id = ?', [ ele.post_id ], (err, result, fields) => {
        console.log('comment',result)
        commentAmount = result.commentCount
      })

      pool.query('SELECT * FROM users WHERE userid = ?', [ ele.user_id ], (err, result, fields) => {
        console.log('user',result)
        userInfo = result
      })

      const post = { ...ele , likeAmount, commentAmount, userInfo }
    });

    callback(true, post)
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

function searchPostByTab(tab, callback) {
  const query = 'SELECT * FROM posts WHERE tab = ?';

  pool.query(query, [tab], (err, result) => {
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
    search,
    searchPostByTab
}
