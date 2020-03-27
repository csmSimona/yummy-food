var express = require('express');
var router = express.Router();
var Recipes = require('../models/Recipes');
var RecipesDraft = require('../models/RecipesDraft');
var User = require('../models/User');
var pWriteFile = require('../utils/pWriteFile');

// 视频存本地
router.post('/uploadVideo', function(req, res, next) {
    var video = req.body.video;
   
    var filePath = '../src/statics/video/'+ Date.now() +'.mp4';
  
    var base64 = video.replace(/^data:video\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64, 'base64'); // 把base64码转成buffer对象
  
    pWriteFile(filePath, dataBuffer)
    .then(() => {
        console.log('写入成功！');
        let videoUrl = filePath.replace('../src/', '');
        res.send({code: 200, videoUrl: videoUrl});
      }, (err) => {
        console.log('err:', err);
        return res.status(500).send(err);
      })
});

router.post('/createRecipes', function(req, res, next) {
    var recipesList = req.body;
    var date = new Date();
    recipesList.createDate = date;

    var data = [recipesList.album[0].url];
    recipesList.cookSteps.forEach(item => {
        data.push(item.img[0].url);
    })

    var actionArr = [];
    var filePathList = []

    data.forEach((item, index) => {
        var filePath = '../src/statics/images/recipes/' + Date.now() + index + '.png';
        filePathList.push(filePath);
        var base64 = item.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64, 'base64');
        actionArr.push(pWriteFile(filePath, dataBuffer))
    })

    Promise.all(actionArr).then(() => {
        
        console.log('写入成功！');
  
        recipesList.album[0].url = filePathList[0].replace('../src/', '')
        filePathList.shift();
        recipesList.cookSteps.forEach((item, index) => {
            item.img[0].url = filePathList[index].replace('../src/', '')
        })


        new Recipes(recipesList).save(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error.');
            }
            console.log('save recipesList', data)
            res.send({code: 200, data: data});
        });
  
      }, (err) => {
        console.log('err:', err);
      })


});

router.post('/saveRecipesDraft', function(req, res, next) {
    var recipesList = req.body;
    var date = new Date();
    recipesList.createDate = date;
    new RecipesDraft(recipesList).save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
        }
        res.send({code: 200});
    });
});

router.get('/getRecipes', function(req, res, next) {
    Recipes.find({}, {
        _id: 1,
        album: 1,
        collectionNumber: 1,
        recipeName: 1,
        userId: 1
    }, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

router.post('/addCollectRecipes', function(req, res, next) {
    var userId = req.body.userId;
    var recipeId = req.body.recipeId;
    var collectRecipes = req.body.collectRecipes;
    var collectionNumber = req.body.collectionNumber;

    User.updateOne({_id: userId}, {$set: {collectRecipes: collectRecipes}}, function (err, data) {
        if (err) {
          console.log('updateUser err', err)
        }
        console.log('updateUser data', data)
    })

    Recipes.updateOne({_id: recipeId}, {$set: {collectionNumber: collectionNumber}}, function (err, data) {
        if (err) {
          console.log('updateRecipes err', err)
        }
        console.log('updateRecipes data', data)
    })
    return res.json({ code: 200 });
});

router.post('/getRecipesDetail', function(req, res, next) {
    Recipes.findOne({_id: req.body.id}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});


// 查找属于用户的菜谱
router.post('/findRecipesByUseId', function(req, res) {
    Recipes.find({userId: req.body.userId}, {
            _id: 1,
            album: 1,
            collectionNumber: 1,
            recipeName: 1,
            userId: 1
        }, function (err, data) {
        if (err) {
            return res.status(500).send('查询失败');
        } else {
            console.log('recipes data', data)
            return res.json({ code: 200, data: data });
        }
    })
});

module.exports = router;
