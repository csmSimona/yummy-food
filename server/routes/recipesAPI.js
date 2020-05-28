var express = require('express');
var router = express.Router();
var Recipes = require('../models/Recipes');
var RecipesDraft = require('../models/RecipesDraft');
var User = require('../models/User');
var pWriteFile = require('../utils/pWriteFile');
var CollectInform = require('../models/CollectInform');

// 视频存本地
router.post('/uploadVideo', function(req, res, next) {
    var video = req.body.video;
   
    var filePath = '../src/statics/video/'+ Date.now() +'.mp4';
  
    var base64 = video.replace(/^data:video\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64, 'base64'); // 把base64码转成buffer对象
  
    pWriteFile(filePath, dataBuffer)
    .then(() => {
        console.log('写入成功！');
        let videoUrl = filePath.replace('../src', '');
        console.log(videoUrl)
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
        try {
            let uploadType = item.split('/')[0];
            if (uploadType === 'data:video') {
                var filePath = '../src/statics/video/'+ Date.now() +'.mp4';
                var base64 = item.replace(/^data:video\/\w+;base64,/, "");
            } else {
                var filePath = '../src/statics/images/recipes/' + Date.now() + index + '.png';
                var base64 = item.replace(/^data:image\/\w+;base64,/, "");
            }
            filePathList.push(filePath);
            var dataBuffer = new Buffer(base64, 'base64');
            actionArr.push(pWriteFile(filePath, dataBuffer))
        } catch(err) {
            console.log('forEach err', err)
        }
    })
    console.log('filePathList', filePathList);

    Promise.all(actionArr).then(() => {
        
        console.log('写入成功！');
  
        recipesList.album[0].url = filePathList[0].replace('../src/', '')
        filePathList.shift();
        recipesList.cookSteps.forEach((item, index) => {
            item.img[0].url = filePathList[index].replace('../src/', '')
        })

        if (recipesList.recipesDraftId) {
            RecipesDraft.remove({_id: recipesList.recipesDraftId}, function (error) {
                if (error) {
                    console.error(error);
                }
            });
        }

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

    if (recipesList.recipesDraftId) {
        RecipesDraft.updateOne({_id: recipesList.recipesDraftId}, {$set: {
            album: recipesList.album,
            cookSteps: recipesList.cookSteps,
            materials: recipesList.materials,
            recipeName: recipesList.recipeName,
            recipeStory: recipesList.recipeStory,
            recipeTips: recipesList.recipeTips,
            recommend: recipesList.recommend,
            selected: recipesList.selected
          }}, function (err, data) {
            if (err) {
                console.log('updateRecipesDraft err', err)
            }
            res.send({code: 200});
            console.log('updateRecipesDraft data', data)
        })
    } else {
        var date = new Date();
        recipesList.createDate = date;
        new RecipesDraft(recipesList).save(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error.');
            }
            res.send({code: 200});
        });
    }

});

router.post('/getRecipes', function(req, res, next) {
    let pageSize = 10
    Recipes.find({}, {
        _id: 1,
        album: 1,
        collectionList: 1,
        collectionNumber: 1,
        recipeName: 1,
        userId: 1
    })
    .sort({collectionNumber: -1, followNumber: -1})
    .skip((req.body.initPage - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱信息失败');
        } else {
            var actionArr = []
            data.forEach(item => {
                actionArr.push(User.findOne({ _id: item.userId}))
            })
            let recipesList = JSON.parse(JSON.stringify(data));
            Promise.all(actionArr).then(function (res) {
                for (var i = 0; i < res.length; i++) {
                    var userData = res[i];
                    recipesList[i].writer = userData;
                    recipesList[i].userName = userData.name;
                    recipesList[i].avatar = userData.img[0].url;
                }
            }).then(() => {
                return res.json({ code: 200, data: recipesList });
            }).catch(function (err) {
                console.log('err', err);
            })
        }
    });
});

router.post('/getRecipesById', function(req, res, next) {
    Recipes.findOne({_id: req.body.id}, {
        _id: 1,
        album: 1,
        recipeName: 1
    }, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

router.post('/addCollectRecipes', function(req, res, next) {
    var writerId = req.body.writerId;
    var userId = req.body.userId;
    var recipeId = req.body.recipeId;
    var collectRecipes = req.body.collectRecipes;
    var collectionList = req.body.collectionList;
    var collectionNumber = req.body.collectionNumber;
    var type = req.body.type;

    User.updateOne({_id: userId}, {$set: {collectRecipes: collectRecipes}})
    .then(() => {
        return Recipes.updateOne({_id: recipeId}, {$set: {collectionList: collectionList, collectionNumber: collectionNumber}})
    }).then(() => {
        if (type === 'add') {
            let createDate = new Date();
            new CollectInform({writerId, userId, createDate, recipeId}).save(function (err, data) {
              if (err) {
                  console.log(err);
                  return res.status(500).send('Server error.');
              }
            });
        }
        return res.json({ code: 200 });
    })
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
            collectionList: 1,
            collectionNumber: 1,
            followNumber: 1,
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


// 获取用户收藏的菜谱
router.post('/getCollectRecipesList', function(req, res) {
    let collectRecipes = req.body.collectRecipes;
    let collectRecipesList = [];
    var actionArr = []

    collectRecipes.forEach(item => {
        actionArr.push(Recipes.findOne({_id: item}))
    })

    Promise.all(actionArr).then((data) => {
        collectRecipesList.push(data);
    }).then(() => {
        return res.json({ code: 200, data: collectRecipesList[0] });
    }).catch(function (err) {
        console.log('err', err)
        return res.status(500).send('查询失败');
    })
});

// 添加跟做的
router.post('/addFollowRecipes', function(req, res) {
    let followNumber = req.body.followNumber;
    let followList = req.body.followList;
    let recipeId = req.body.recipeId;
    Recipes.updateOne({_id: recipeId}, {$set: {followNumber: followNumber, followList: followList}}, function (err, data) {
        if (err) {
            console.log('addFollowRecipes err', err)
        } else {
            console.log('addFollowRecipes data', data)
            return res.json({ code: 200 });
        }
    })
});

// 删除菜谱
router.post('/deleteRecipes', function(req, res) {
    let recipeId = req.body.recipeId;
    Recipes.remove({_id: recipeId}, function (error) {
        if (error) {
            console.error(error);
        } else {
            return res.json({ code: 200 });
        }
    });
});

// 更新菜谱
router.post('/updateRecipes', function(req, res, next) {
    var recipesList = req.body;

    var data = [recipesList.album[0].url];
    recipesList.cookSteps.forEach(item => {
        data.push(item.img[0].url);
    })

    var actionArr = [];
    var filePathList = []
        
    data.forEach((item, index) => {
        if (item.substring(0, 4) === 'data') {
            var filePath = '../src/statics/images/recipes/' + Date.now() + index + '.png';
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
        recipesList.album[0].url = recipesList.album[0].url.substring(0, 4) === 'data' ? filePathList[0].replace('../src/', '') : recipesList.album[0].url
        filePathList.shift();
        recipesList.cookSteps.forEach((item, index) => {
            if (item.img[0].url.substring(0, 4) === 'data') {
                item.img[0].url = filePathList[index].replace('../src/', '')
            }
        })

        Recipes.updateOne({_id: recipesList.recipeId}, {$set: {
            album: recipesList.album,
            cookSteps: recipesList.cookSteps,
            materials: recipesList.materials,
            recipeName: recipesList.recipeName,
            recipeStory: recipesList.recipeStory,
            recipeTips: recipesList.recipeTips,
            recommend: recipesList.recommend,
            selected: recipesList.selected
          }}, function (err, data) {
            if (err) {
              return res.status(500).send('更新菜谱失败');
            }
            console.log('update data', data)
            return res.json({ code: 200 });
          })
      }, (err) => {
        console.log('err:', err);
      })
});


// 查找属于用户的菜谱草稿
router.post('/findRecipesDraftByUseId', function(req, res) {
    RecipesDraft.find({userId: req.body.userId}, function (err, data) {
        if (err) {
            return res.status(500).send('查询失败');
        } else {
            console.log('recipes data', data)
            return res.json({ code: 200, data: data });
        }
    })
});

// 删除菜谱草稿
router.post('/deleteRecipesDraft', function(req, res) {
    let recipeDraftId = req.body.recipeDraftId;
    RecipesDraft.remove({_id: recipeDraftId}, function (error) {
        if (error) {
            console.error(error);
        } else {
            return res.json({ code: 200 });
        }
    });
});

module.exports = router;
