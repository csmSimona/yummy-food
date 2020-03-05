var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET user listing. */
router.get('/getUser', function(req, res, next) {
  User.find(function (err, data) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    return res.json({ success: true, data: data });
  })
});

router.post('/addUser', function(req, res, next) {
  new User(req.body).save(function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    return res.json({ success: true });
  })
});

module.exports = router;
