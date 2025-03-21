//commentModel.js
const pool = require('../config/db')

// comments表
// CREATE TABLE comments(
// comments_id INT AUTO_INCREMENT PRIMARY KEY,
// user_id INT,
// post_id INT,
// comment TEXT,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
// FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
// );

function createComment(info, callback) {
    const { userid, postid, comment, anonymous } = info;

    const query = 'INSERT INTO comments (user_id, post_id, comment, anonymous, created_at) VALUES (?, ?, ?, ?, NOW())';
    pool.query(query, [userid, postid, comment, anonymous], (err, result, fields) => {
        if (err) {
            console.error('Error creating comment:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Comment created success' , comment_id: result.insertId });
    });
}

function getCommentsList(callback){
    pool.query('SELECT * FROM comments', (err, res, fields) => {
      callback(!!err, res);
    });
}
  
function deleteComments(id, callback) {
    const query = 'DELETE FROM comments WHERE comments_id = ?';
   
    pool.query(query, id, (err, result) => {
        try{
            if (result.affectedRows === 0) {
                return callback(null, new Error('No comment found with that ID'));
            }
        
            callback(null, { message: 'comment deleted successfully' });
        }
        catch{
            callback(true, new Error('No comment found with that ID'))
        }
    });
}
  
function findCommentsByUserId(userId, callback) {
    const query = 'SELECT * FROM comments WHERE user_id = ?';
  
    pool.query(query, [userId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'err,not found' })
        }
    });
}

function findCommentsAmount(postId, callback){
    const query = 'SELECT COUNT(*) FROM comments WHERE post_id = ?'

    pool.query(query, [postId], (err, result) => {
        if (err) 
            callback(true, err)

        callback(null, result)
    })
}

function findCommentsByPostId(postId, callback) {
    const query = 'SELECT * FROM comments WHERE post_id = ?';
  
    pool.query(query, [postId], (err, result) => {
        try{
            callback(null, result)
        }
        catch{
            callback(true, { message: 'not found' })
        }
    });
}

module.exports = {
    createComment,
    getCommentsList,
    deleteComments,
    findCommentsByPostId,
    findCommentsByUserId,
    findCommentsAmount,
};
