var express = require('express');
var router = express.Router();
var Recipes = require('../models/Recipes');
var RecipesDraft = require('../models/RecipesDraft');
var User = require('../models/User');

router.post('/createRecipes', function(req, res, next) {
    var recipesList = req.body;
    var date = new Date();
    recipesList.createDate = date;
    new Recipes(recipesList).save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
        }
        res.send({code: 200});
    });
});

router.post('/saveRecipes', function(req, res, next) {
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
    Recipes.find(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取菜谱信息失败');
        }
        let recipesList = data;
        delete recipesList.cookSteps;
        delete recipesList.materials;
        delete recipesList.recommend;
        delete recipesList.selected;
        delete recipesList.recipeStory;
        delete recipesList.recipeTips;
        delete recipesList.recipeTips;

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


module.exports = router;
