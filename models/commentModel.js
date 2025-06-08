//commentModel.js
const pool = require('../config/db')

//帖子评论
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

//回复

function createReply(info, callback) {
    const { userid, postid, parentid , comment, anonymous } = info;

    const query = 'INSERT INTO comments (user_id, post_id, parent_id , comment, anonymous, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    pool.query(query, [userid, postid, parentid, comment, anonymous], (err, result, fields) => {
        if (err) {
            console.error('Error creating comment:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Comment created success' , comment_id: result.insertId });
    });
}

module.exports = {
    createComment,
    getCommentsList,
    deleteComments,
    findCommentsByPostId,
    findCommentsByUserId,
    findCommentsAmount,
    createReply,
};
