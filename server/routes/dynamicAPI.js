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
    var likeList = req.body.likeList;
    var likeNumber = req.body.likeNumber;

    User.updateOne({_id: userId}, {$set: {likeDynamic: likeDynamic}}, function (err, data) {
        if (err) {
          console.log('updateUser err', err)
        }
        console.log('updateUser data', data)
    })

    Dynamic.updateOne({_id: dynamicId}, {$set: {likeList: likeList, likeNumber: likeNumber}}, function (err, data) {
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

// 查找属于用户的动态
router.post('/findDynamicByUseId', function(req, res) {
    Dynamic.find({userId: req.body.userId}, function (err, data) {
      if (err) {
        return res.status(500).send('查询失败');
      } else {
          console.log('dynamic data', data)
        return res.json({ code: 200, data: data });
      }
    })
});

// 获取用户点赞的动态
router.post('/getLikeDynamicList', function(req, res) {
    let likeDynamic = req.body.likeDynamic;
    let likeDynamicList = [];
    var actionArr = []

    likeDynamic.forEach(item => {
        actionArr.push(Dynamic.findOne({_id: item}))
    })

    Promise.all(actionArr).then((data) => {
        console.log('dynamic data', data)
        likeDynamicList.push(data);
    }).then(() => {
        return res.json({ code: 200, data: likeDynamicList[0] });
    }).catch(function (err) {
        console.log('err', err)
        return res.status(500).send('查询失败');
    })
});

// 更新菜谱
router.post('/editDynamic', function(req, res, next) {
    var dynamicList = req.body;

    var data = [];
    dynamicList.imgs.forEach(item => {
        data.push(item.url);
    })

    var actionArr = [];
    var filePathList = []
        
    data.forEach((item, index) => {
        if (item.substring(0, 4) === 'data') {
            var filePath = '../src/statics/images/dynamic/' + Date.now() + index + '.png';
            filePathList.push(filePath);
            var base64 = item.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64, 'base64');
            actionArr.push(pWriteFile(filePath, dataBuffer))
        } else {
            filePathList.push(item);
        }
    })

    Promise.all(actionArr).then(() => {
        console.log('写入成功！');
        dynamicList.imgs.forEach((item, index) => {
            if (item.url.substring(0, 4) === 'data') {
                item.url = filePathList[index].replace('../src/', '')
            }
        })
        Dynamic.updateOne({_id: dynamicList.dynamicId}, {$set: {
            imgs: dynamicList.imgs,
            recommend: dynamicList.recommend,
            dynamicName: dynamicList.dynamicName,
            dynamicStory: dynamicList.dynamicStory,
            followRecipes: dynamicList.followRecipes
          }}, function (err, data) {
            if (err) {
              return res.status(500).send('更新动态失败');
            }
            console.log('update data', data)
            return res.json({ code: 200 });
          })
      }, (err) => {
        console.log('err:', err);
      })
});

// 删除动态
router.post('/deleteDynamic', function(req, res) {
    let dynamicId = req.body.dynamicId;
    Dynamic.remove({_id: dynamicId}, function (error) {
        if (error) {
            console.error(error);
        } else {
            return res.json({ code: 200 });
        }
    });
});

router.post('/getDynamicDetailByUserId', function(req, res, next) {
    Dynamic.find({userId: req.body.userId}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取动态信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

module.exports = router;
