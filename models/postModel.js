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

async function getPostsList(page) {
  const chunkSize = 10; // 假设每页显示10条数据，这个值需要根据实际情况设置
  const limit = (page + 1) * chunkSize;
 
  try {
    // 获取帖子列表
    const postsResult = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT ?', [limit]);
    const posts = postsResult[0];
 
    // 创建一个 Promise 数组，每个 Promise 异步获取帖子的详细信息
    const promises = posts.map(async ele => {
      const likeResult = await pool.query('SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?', [ele.post_id]);
      const commentResult = await pool.query('SELECT COUNT(*) AS commentCount FROM comments WHERE post_id = ?', [ele.post_id]);
      const userResult = await pool.query('SELECT * FROM users WHERE userid = ?', [ele.user_id]);
 
      return {
        ...ele,
        likeAmount: likeResult[0].likeCount,
        commentAmount: commentResult[0].commentCount,
        userInfo: userResult[0]
      };
    });
 
    const enhancedPosts = await Promise.all(promises);
 
    return enhancedPosts;
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw err;
  }
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
