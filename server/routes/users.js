var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  User.find(function (err, data) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    return res.json({ success: true, data: data });
  })
  // res.send("get users");
});

module.exports = router;
