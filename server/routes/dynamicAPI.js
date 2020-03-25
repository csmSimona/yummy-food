var express = require('express');
var router = express.Router();
var Dynamic = require('../models/Dynamic');
var pWriteFile = require('../utils/pWriteFile');
var User = require('../models/User');

router.post('/createDynamic', function(req, res, next) {
    var dynamicList = req.body;
    var date = new Date();
    dynamicList.createDate = date;

    var actionArr = [];
    var filePathList = []

    console.log('dynamicList.imgs', dynamicList.imgs.length);

    dynamicList.imgs.forEach((item, index) => {
        var filePath = '../src/statics/images/dynamic/' + Date.now() + index + '.png';
        console.log('filePath', filePath, index);
        filePathList.push(filePath);
        var base64 = item.url.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64, 'base64');
        // var dataBuffer = Buffer.alloc(base64, 'base64') // New
        actionArr.push(pWriteFile(filePath, dataBuffer))
        console.log(index);

    })
    console.log('actionArr', actionArr);
    console.log('filePathList', filePathList);

    Promise.all(actionArr).then(() => {
        console.log('写入成功！');
        dynamicList.imgs.forEach((item, index) => {
            item.url = filePathList[index].replace('../src/', '')
        })
        console.log('dynamicList.imgs', dynamicList.imgs);
        new Dynamic(dynamicList).save(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send(err)
            }
            res.send({code: 200, data: data});
        });
      }, (err) => {
        console.log('err:', err);
      })
});

router.get('/getDynamic', function(req, res, next) {
    Dynamic.find(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取动态信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

router.post('/addLikeDynamic', function(req, res, next) {
    var userId = req.body.userId;
    var dynamicId = req.body.dynamicId;
    var likeDynamic = req.body.likeDynamic;
    var likeNumber = req.body.likeNumber;

    User.updateOne({_id: userId}, {$set: {likeDynamic: likeDynamic}}, function (err, data) {
        if (err) {
          console.log('updateUser err', err)
        }
        console.log('updateUser data', data)
    })

    Dynamic.updateOne({_id: dynamicId}, {$set: {likeNumber: likeNumber}}, function (err, data) {
        if (err) {
          console.log('updateDynamic err', err)
        }
        console.log('updateDynamic data', data)
    })
    return res.json({ code: 200 });
});

router.post('/getDynamicDetail', function(req, res, next) {
    Dynamic.findOne({_id: req.body.id}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取动态信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

module.exports = router;
