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

function getPostsList(page, callback) {
  const limit = (page + 1) * chunkSize; // 确保 chunkSize 在这个函数的作用域内或者作为参数传入
 
  pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT ?', [limit], (err, postsResult, fields) => {
    if (err) {
      return callback(err, null);
    }
 
    const posts = postsResult;
    const enhancedPosts = [];
 
    function processPost(index) {
      if (index >= posts.length) {
        return callback(null, enhancedPosts);
      }
 
      const post = posts[index];
 
      pool.query('SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?', [post.post_id], (err, likeResult, fields) => {
        if (err) {
          return callback(err, null);
        }
 
        pool.query('SELECT COUNT(*) AS commentCount FROM comments WHERE post_id = ?', [post.post_id], (err, commentResult, fields) => {
          if (err) {
            return callback(err, null);
          }
 
          pool.query('SELECT * FROM users WHERE userid = ?', [post.user_id], (err, userResult, fields) => {
            if (err) {
              return callback(err, null);
            }
 
            const enhancedPost = {
              ...post,
              likeAmount: likeResult[0].likeCount,
              commentAmount: commentResult[0].commentCount,
              userInfo: userResult[0]
            };
 
            enhancedPosts.push(enhancedPost);
            processPost(index + 1); // 递归调用处理下一个帖子
          });
        });
      });
    }
 
    processPost(0); // 从第一个帖子开始处理
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

function searchPostByTab(data, callback) {
  const { tab, count } = data;
  const limit = (count + 1) * 5; // 每页5条
  
  console.log('model', tab, limit);

  pool.query('SELECT * FROM posts WHERE tab = ? LIMIT ?', [tab, limit], (err, postsResult, fields) => {
    if (err) {
      return callback(err, null);
    }

    const posts = postsResult;
    const enhancedPosts = [];

    function processPost(index) {
      if (index >= posts.length) {
        return callback(null, enhancedPosts);
      }

      const post = posts[index];

      pool.query('SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?', [post.post_id], (err, likeResult, fields) => {
        if (err) {
          return callback(err, null);
        }

        pool.query('SELECT COUNT(*) AS commentCount FROM comments WHERE post_id = ?', [post.post_id], (err, commentResult, fields) => {
          if (err) {
            return callback(err, null);
          }

          pool.query('SELECT * FROM users WHERE userid = ?', [post.user_id], (err, userResult, fields) => {
            if (err) {
              return callback(err, null);
            }

            const enhancedPost = {
              ...post,
              likeAmount: likeResult[0].likeCount,
              commentAmount: commentResult[0].commentCount,
              userInfo: userResult[0]
            };

            enhancedPosts.push(enhancedPost);
            processPost(index + 1); // 递归调用处理下一个帖子
          });
        });
      });
    }

    processPost(0); // 从第一个帖子开始处理
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
