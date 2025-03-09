//notificationModel.js
const pool = require('../config/db')

function createNotification(info, callback) {
    const { title, userid, content , images } = info;
    const query = 'INSERT INTO notification (title, userid, content, images, created_at) VALUES (?, ?, ?, ?, NOW())';

    pool.query(query, [title, userid, content, JSON.stringify(images)], (err, result, fields) => {
        if (err) {
            console.error('Error creating notification:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Notification created success' , no_id: result.insertId });
    });
}

function getNotificationsList(callback){
    pool.query('SELECT * FROM notification', (err, res, fields) => {
      callback(!!err, res);
    });
}

function getNotificationsListById(userid,callback){
    pool.query('SELECT * FROM notification WHERE userid = ?', [userid], (err, res, fields) => {
      callback(!!err, res);
    });
}

module.exports = {
    createNotification,
    getNotificationsList,
    getNotificationsListById
}
