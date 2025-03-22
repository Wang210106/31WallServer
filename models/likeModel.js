//likeModel.js
const pool = require('../config/db')

//likes表
// CREATE TABLE likes(
// like_id INT AUTO_INCREMENT PRIMARY KEY,
// user_id INT,
// post_id INT,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
// FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
// );

function createLike(info, callback) {
    const { userid, postid } = info;
    const query = 'INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, NOW())';
    pool.query(query, [userid, postid], (err, result, fields) => {
        if (err) {
            console.error('Error creating like:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Like created success' });
    });
}

function createCommentLike(info, callback) {
    const { userid, commentid } = info;
    const query = 'INSERT INTO likes (user_id, comments_id, created_at) VALUES (?, ?, NOW())';
    pool.query(query, [userid, commentid], (err, result, fields) => {
        if (err) {
            console.error('Error creating like:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Like created success' });
    });
}

function getLikesList(callback){
    pool.query('SELECT * FROM likes', (err, res, fields) => {
      callback(!!err, res);
    });
}
  
function deleteLikes(info, callback) {
    const query = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
   
    pool.query(query, [ info.userid, info.postid ], (err, result) => {
        try{
            if (result.affectedRows === 0) {
                return callback(null, new Error('No like found with that ID'));
            }
        
            callback(null, { message: 'like deleted successfully', deletedlikeId: likeId });
        }
        catch{
            callback(true, new Error('No like found with that ID'))
        }
    });
}

function deleteCommentLikes(info, callback) {
    const query = 'DELETE FROM likes WHERE user_id = ? AND comments_id = ?';
   
    pool.query(query, [ info.userid, info.commentid ], (err, result) => {
        try{
            if (result.affectedRows === 0) {
                return callback(null, new Error('No like found with that ID'));
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

function findLikesAmount(postId, callback) {
    const query = 'SELECT COUNT(*) FROM likes WHERE post_id = ?';
  
    pool.query(query, [postId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'err,not found' })
        }
    });
}

function findCommentsLikesAmount(commentsId, callback) {
    const query = 'SELECT COUNT(*) FROM likes WHERE comments_id = ?';
  
    pool.query(query, [commentsId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'err,not found' })
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

function isLiked(user_id, post_id, callback) {
    const checkQuery = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
    pool.query(checkQuery, [user_id, post_id], (err, results) => {
        if (err) {
            console.error('Error checking like:', err);
            return callback(new Error('Internal server error'));
        }
        
        callback(null, results.length > 0);
    });
}

function isCommentLiked(user_id, comments_id, callback) {
    const checkQuery = 'SELECT * FROM likes WHERE user_id = ? AND comments_id = ?';
    pool.query(checkQuery, [user_id, comments_id], (err, results) => {
        if (err) {
            console.error('Error checking like:', err);
            return callback(new Error('Internal server error'));
        }
        
        callback(null, results.length > 0);
    });
}

module.exports = {
    createLike,
    getLikesList,
    deleteLikes,
    findLikesByPostId,
    findLikesByUserId,
    isLiked,
    findLikesAmount,
    deleteCommentLikes,
    createCommentLike,
    isCommentLiked,
    findCommentsLikesAmount,
};
