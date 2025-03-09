const express = require("express");
const router = express.Router();

const reportModel = require('../models/reportModel');
const notificationModel = require('../models/notificationModel');

router.get('/all', (req, res) => {
    reportModel.getReportsList((err, result) => {
        if (err)
            return res.status(500).json({ message : 'Can\'t get list' });

        res.json(result)
    })
})

router.post('/', (req, res) => {
  const newReport = req.body; 

  reportModel.createReport(newReport, (err, result) => {
    if (err)
        return res.status(500).json({ message : 'Created Report Failed', result })

    res.json(result)
  })
})

router.post('/notice', (req, res) => {
  const newNo = req.body; 

  reportModel.createReport(newNo, (err, result) => {
    if (err)
        return res.status(500).json({ message : 'Created Notification Failed', result })

    res.json(result)
  })
})

router.get('/notice', (req, res) => {
  const userid = req.query.userid

  notificationModel.getNotificationsListById(userid, (err, result) => {
      if (err)
          return res.status(500).json({ message : 'Can\'t get list' });

      res.json(result)
  })
})

router.delete('/', (req, res) => {
    const report_id = req.query.id

  reportModel.deleteReports(report_id, (err, result) => {
    if (err) {
      return res.status(400).json({ message: 'Can\'nt delete' });
    }

    res.json(result)
  })
})

module.exports = router;
