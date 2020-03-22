var express = require('express');
var router = express.Router();
var Dynamic = require('../models/Dynamic');

router.post('/createDynamic', function(req, res, next) {
    var dynamicList = req.body;
    var date = new Date();
    dynamicList.createDate = date;
    new Dynamic(dynamicList).save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error.')
        }
        res.send({code: 200});
    });
});

module.exports = router;
