//reportModel.js
const pool = require('../config/db')

//report表
// CREATE TABLE reports (
// report_id INT AUTO_INCREMENT PRIMARY KEY,
// title VARCHAR(255),
// content TEXT,
// type TEXT,
// marked_id INT,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

function createReport(info, callback) {
    const { user_id, type, marked_id , content } = info;
    const query = 'INSERT INTO reports (user_id, type, marked_id, content, created_at) VALUES (?, ?, ?, ?, NOW())';
    pool.query(query, [user_id, type, marked_id, content], (err, result, fields) => {
        if (err) {
            console.error('Error creating report:', err);
            return callback(new Error('Internal server error'));
        }
        callback(null, { message: 'Report created success' , report_id: result.insertId });
    });
}

function getReportsList(callback){
    pool.query('SELECT * FROM reports', (err, res, fields) => {
      callback(!!err, res);
    });
}
  
function deleteReports(id, callback) {
    const query = 'DELETE FROM reports WHERE report_id = ?';
   
    pool.query(query, id, (err, result) => {
        try{
            if (result.affectedRows === 0) {
                return callback(null, new Error('No report found with that ID'));
            }
        
            callback(null, { message: 'report deleted successfully' });
        }
        catch{
            callback(true, new Error('No report found with that ID'))
        }
    });
}

module.exports = {
    createReport,
    getReportsList,
    deleteReports,
}
