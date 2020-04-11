var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var CommentInform = require('../models/CommentInform');
var User = require('../models/User');
var Recipes = require('../models/Recipes');
var Dynamic = require('../models/Dynamic');
var FanInform = require('../models/FanInform');
var CollectInform = require('../models/CollectInform');
var LikeInform = require('../models/LikeInform');

// 发布评论
router.post('/sendComment', function(req, res) {
  let comment = req.body.comment
  var date = new Date();
  comment.createDate = date;

  new Comment(comment).save(function (err, data) {
      if (err) {
          console.log(err);
          return res.status(500).send('Server error.');
      }
      console.log('save Comment', data)
      res.send({code: 200, data: data});
  });
});

// 获取菜谱评论
router.post('/getRecipeComment', function(req, res) {
  Comment.find({recipeId: req.body.recipeId})
  // .sort({'_id':-1})
  .exec(function (err, data) {
      if (err) {
          console.log(err);
          return res.status(500).send('获取菜谱评论信息失败');
      }
      return res.json({ code: 200, data: data });
  })
});

// 获取动态评论
router.post('/getDynamicComment', function(req, res) {
    Comment.find({dynamicId: req.body.dynamicId})
    // .sort({'_id':-1})
    .exec(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取动态评论信息失败');
        }
        return res.json({ code: 200, data: data });
    })
});

// 删除评论
router.post('/deleteComment', function(req, res) {
  let commentId = req.body.commentId;
  Comment.remove({_id: commentId}, function (error) {
      if (error) {
          console.error(error);
      } else {
          return res.json({ code: 200 });
      }
  });
});

// 发布评论
router.post('/addCommentInform', function(req, res) {
    let commentInform = req.body.commentInform
  
    new CommentInform(commentInform).save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
        }
        console.log('save CommentInform', data)
        res.send({code: 200, data: data});
    });
});

// 未读评论通知数量
router.post('/getUnreadCommentNumber', function(req, res) {
    CommentInform.countDocuments(CommentInform.find({userId: req.body.userId, read: false}), function (err, doc) { // 查询总条数（用于分页）
       if (err) {
         console.log(err)
       } else {
         count = doc;
         return res.json({ code: 200, data: count });
       }
     })
});

// 未读评论通知
router.post('/getUnreadComment', function(req, res) {
    CommentInform.find({userId: req.body.userId}, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('获取未读评论通知信息失败');
        }
        return res.json({ code: 200, data: data });
    });
});

// 获取评论详情
router.post('/getCommentDetail', function(req, res) {
    let commentInform = req.body.commentInform;
    let commentDetail = {};
    // 需要获得  评论人 头像名字  评论的菜谱/动态 首图 id   评论的内容
    User.findOne({ _id: commentInform.writerId}).then((userData) => {
        commentDetail.writer = userData;
        return Comment.findOne({ _id: commentInform.commentId});
    }).then((commentData) => {
        commentDetail.comment = commentData;
        if (commentData.recipeId) {
            return Recipes.findOne({ _id: commentData.recipeId}, {
                _id: 1,
                album: 1,
                recipeName: 1
            })
        } else {
            return Dynamic.findOne({ _id: commentData.dynamicId}, {
                _id: 1,
                imgs: 1,
                dynamicName: 1
            })
        }
    }).then((data) => {
        if (data.album) {
            commentDetail.recipes = data;
        } else {
            commentDetail.dynamic = data;
        }
        return CommentInform.update({_id: commentInform._id}, {$set: {read: true}});
    }).then(updateData => {
        console.log('updateData', updateData)
        return res.json({ code: 200, data: commentDetail });
    }).catch(err => {
        console.log('err', err);
    })
});

// 未读新增粉丝通知数量
router.post('/getUnreadFanNumber', function(req, res) {
    FanInform.countDocuments(FanInform.find({writerId: req.body.writerId, read: false}), function (err, doc) { // 查询总条数（用于分页）
       if (err) {
         console.log(err)
       } else {
         count = doc;
         return res.json({ code: 200, data: count });
       }
     })
});

// 获取新增粉丝通知信息
router.post('/getUnreadFan', function(req, res) {
    FanInform.updateMany({writerId: req.body.writerId}, {$set: {read: true}}).then(() => {
        return FanInform.find({writerId: req.body.writerId})
    }).then((data) => {
        return res.json({ code: 200, data: data });
    }).catch(err => {
        console.log('err', err);
    })
});

// 未读收藏菜谱通知数量
router.post('/getUnreadCollectNumber', function(req, res) {
    CollectInform.countDocuments(CollectInform.find({writerId: req.body.writerId, read: false}), function (err, doc) { // 查询总条数（用于分页）
       if (err) {
         console.log(err)
       } else {
         count = doc;
         return res.json({ code: 200, data: count });
       }
     })
});

// 收藏菜谱通知
router.post('/getUnreadCollect', function(req, res) {
    CollectInform.updateMany({writerId: req.body.writerId}, {$set: {read: true}}).then(() => {
        return CollectInform.find({writerId: req.body.writerId})
    }).then((data) => {
        return res.json({ code: 200, data: data });
    }).catch(err => {
        console.log('err', err);
    })
});

// 未读点赞动态通知数量
router.post('/getUnreadLikeNumber', function(req, res) {
    LikeInform.countDocuments(LikeInform.find({writerId: req.body.writerId, read: false}), function (err, doc) { // 查询总条数（用于分页）
       if (err) {
         console.log(err)
       } else {
         count = doc;
         return res.json({ code: 200, data: count });
       }
     })
});

// 点赞动态通知
router.post('/getUnreadLike', function(req, res) {
    LikeInform.updateMany({writerId: req.body.writerId}, {$set: {read: true}}).then(() => {
        return LikeInform.find({writerId: req.body.writerId})
    }).then((data) => {
        return res.json({ code: 200, data: data });
    }).catch(err => {
        console.log('err', err);
    })
});

module.exports = router;
