var express = require('express');
var router = express.Router();
var Classification = require('../models/Classification');
var Recipes = require('../models/Recipes');
var Situation = require('../models/Situation');
var Recommend = require('../models/Recommend');
var Ingredient = require('../models/Ingredient');

router.get('/getClassification', function(req, res, next) {
    Classification.find({}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱分类信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

router.post('/searchRecipes', function(req, res) {
    let searchContent = req.body.searchContent;
    let type = req.body.type;

    //  var count = 0
    //  local.count(_filter, function (err, doc) { // 查询总条数（用于分页）
    //    if (err) {
    //      console.log(err)
    //    } else {
    //      count = doc
    //    }
    //  })

    if (type === 0) {
        Recipes
        .find(
            {
                $or: [  // 多字段同时匹配
                    {recipeName: {$regex: searchContent}},
                    {materials: {$regex: searchContent}},
                    {recommend: {$regex: searchContent}}, //  $options: '$i' 忽略大小写
                    {selected: {$regex: searchContent}}
                ]
            }, 
            {
                _id: 1,
                album: 1,
                collectionList: 1,
                collectionNumber: 1,
                followNumber: 1,
                recipeName: 1,
                userId: 1
            })
        .exec(function (err, data) {
            if (err) {
                return res.status(500).send('查询失败');
            } else {
                console.log('recipes data', data)
                return res.json({ code: 200, data: data });
            }
        })
    } else if (type === 1) {
        Recipes
        .find(
            {
                $or: [  // 多字段同时匹配
                    {recipeName: {$regex: searchContent}},
                    {materials: {$regex: searchContent}},
                    {recommend: {$regex: searchContent}}, //  $options: '$i' 忽略大小写
                    {selected: {$regex: searchContent}}
                ]
            }, 
            {
                _id: 1,
                album: 1,
                collectionList: 1,
                collectionNumber: 1,
                followNumber: 1,
                recipeName: 1,
                userId: 1
            })
        .sort({followNumber:-1})
        .exec(function (err, data) {
            if (err) {
                return res.status(500).send('查询失败');
            } else {
                console.log('recipes data', data)
                return res.json({ code: 200, data: data });
            }
        })
    } else if (type === 2) {
        Recipes
        .find(
            {
                $or: [  // 多字段同时匹配
                    {recipeName: {$regex: searchContent}},
                    {materials: {$regex: searchContent}},
                    {recommend: {$regex: searchContent}}, //  $options: '$i' 忽略大小写
                    {selected: {$regex: searchContent}}
                ]
            }, 
            {
                _id: 1,
                album: 1,
                collectionList: 1,
                collectionNumber: 1,
                followNumber: 1,
                recipeName: 1,
                userId: 1
            })
        .sort({collectionNumber: -1})
        .exec(function (err, data) {
            if (err) {
                return res.status(500).send('查询失败');
            } else {
                console.log('recipes data', data)
                return res.json({ code: 200, data: data });
            }
        })
    } else if (type === 3) {
        Recipes
        .find(
            {
                $or: [  // 多字段同时匹配
                    {recipeName: {$regex: searchContent}},
                    {materials: {$regex: searchContent}},
                    {recommend: {$regex: searchContent}}, //  $options: '$i' 忽略大小写
                    {selected: {$regex: searchContent}}
                ],
                $and: [
                    {album: {$elemMatch: {url: {$regex: 'video'}} }}
                ]
            }, 
            {
                _id: 1,
                album: 1,
                collectionList: 1,
                collectionNumber: 1,
                followNumber: 1,
                recipeName: 1,
                userId: 1
            })
        .exec(function (err, data) {
            if (err) {
                return res.status(500).send('查询失败');
            } else {
                console.log('recipes data', data)
                return res.json({ code: 200, data: data });
            }
        })
    }

});

router.get('/getSituationList', function(req, res, next) {
    Situation.find({}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

router.post('/getSituationDetail', function(req, res, next) {
    Recommend.findOne({name: req.body.name}, function (err, data) {
        if (err) {
            return res.status(500).send('查询失败');
        } else {
            console.log('SituationDetail data', data)
            // data.ingredients
            return res.json({ code: 200, data: data });
        }
    })
});

router.post('/getIngredient', function(req, res, next) {
    console.log('name', req.body.name)
    Ingredient.findOne({
        $or: [  // 多字段同时匹配
            {name: {$regex: req.body.name}},
            {alias: {$regex: req.body.name}}
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).send('查询失败');
        } else {
            console.log('getIngredient data', data)
            return res.json({ code: 200, data: data });
        }
    })
});

module.exports = router;
