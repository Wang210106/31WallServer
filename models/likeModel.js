//likeModel.js
const pool = require('../config/db')

//likes表
// CREATE TABLE likes(
// like_id INT AUTO_INCREMENT PRIMARY KEY,
// user_id INT,
// post_id INT,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// FOREIGN KEY (user_id) REFERENCES users(id),
// FOREIGN KEY (post_id) REFERENCES posts(post_id)
// );

function createLike(info, callback){
    const { user_id, post_id } = info; 
    const query = 'INSERT INTO likes (user_id, post_id , created_at) VALUES (?, ?, NOW())';

    pool.query(query, [ user_id, post_id ],(err, result, fields) => {
      try{
        callback(null, { message: "like created success" })
      }
      catch{
        callback(true, { message: 'requires lacking or other error' })
      }
    })
}

function getLikesList(callback){
    pool.query('SELECT * FROM likes', (err, res, fields) => {
      callback(!!err, res);
    });
}
  
function deleteLikes(info, callback) {
    const query = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
   
    pool.query(query, [ info.user_id, info.post_id ], (err, result) => {
        try{
            if (result.affectedRows === 0) {
                return callback(new Error('No like found with that ID'));
            }
        
            callback(null, { message: 'like deleted successfully', deletedlikeId: likeId });
        }
        catch{
            callback(true, new Error('No like found with that ID'))
        }
    });
  }
  
function findLikesByUserId(userId, callback) {
    const query = 'SELECT * FROM likes WHERE user_id = ?';
  
    pool.query(query, [userId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'err,not found' })
        }
    });
}
  
function findLikesByLikeId(likeId, callback) {
    const query = 'SELECT * FROM likes WHERE like_id = ?';
  
    pool.query(query, [likeId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'not found' })
        }
    });
}

function findLikesByPostId(postId, callback) {
    const query = 'SELECT * FROM likes WHERE post_id = ?';
  
    pool.query(query, [postId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'not found' })
        }
    });
}

function isLiked(user_id, post_id, callback){
    const checkQuery = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
      pool.query(checkQuery, [user_id, post_id], (err, results) => {
        if (err) {
            console.error('Error checking like:', err);
            callback(true,{ message: 'Internal server error' });
        }
  
        // 已经点赞过
        if (results.length > 0) {
            callback(null, true);
        }

        callback(null, false);
      })
  }

module.exports = {
    createLike,
    getLikesList,
    deleteLikes,
    findLikesByLikeId,
    findLikesByPostId,
    findLikesByUserId,
    isLiked,
};
