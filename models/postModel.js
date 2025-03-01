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
  const offset = page * chunkSize; 
 
  // 查询帖子列表
  pool.query('SELECT * FROM posts ORDER BY created_at DESC limit ?, ?', [offset, chunkSize], (err, posts) => {
    if (err) {
      return callback(err, null);
    }

    const postsWithDetails = [];
 
    posts.forEach((post, index) => {
      pool.query('SELECT COUNT(*) as likeCount FROM likes WHERE post_id = ?', [post.post_id], (err, likesResult) => {
        if (err) {
          console.error('Error fetching likes for post', post.post_id, err);
          return; 
        }
 
        // 查询评论数
        pool.query('SELECT COUNT(*) as commentCount FROM comments WHERE post_id = ?', [post.post_id], (err, commentsResult) => {
          if (err) {
            console.error('Error fetching comments for post', post.post_id, err);
            return; 
          }
 
          pool.query('SELECT * FROM users WHERE userid = ?', [post.user_id], (err, userResult) => {
            if (err) {
              console.error('Error fetching user for post', post.post_id, err);
              return; // 或者你可以跳过这个帖子并继续处理下一个
            }
 
            const user = userResult.length > 0 ? userResult : null;
 
            // 构造带有详细信息的帖子对象
            const postWithDetails = {
              ...post,
              likeCount: likesResult.likeCount,
              commentCount: commentsResult.commentCount,
              user
            };
 
            // 将帖子对象添加到结果数组中
            postsWithDetails[index] = postWithDetails;
 
            // 检查是否所有帖子都已处理完毕
            if (postsWithDetails.length === posts.length) {
              // 所有帖子都已处理完毕，调用回调函数返回结果
              callback(null, postsWithDetails);
            }
          });
        });
      });
    });
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
