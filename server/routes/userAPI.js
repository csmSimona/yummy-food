var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SmsRequest = require('../utils/smsRequest');
const request = require('request');
const jwt = require('jsonwebtoken');
var pWriteFile = require('../utils/pWriteFile');
var FanInform = require('../models/FanInform');

// 网易云信
const appKey = "1463872763e2ebb7e7040d5ba4cd1544";
const appSecret = "a9abe64af57c";
var smsRequest = new SmsRequest(appKey, appSecret);

router.get('/getUser', function(req, res, next) {
  User.find(function (err, data) {
    if (err) {
      console.log(err);
      return res.status(500).send('获取用户信息失败');
    }
    return res.json({ code: 200, data: data });
  });
});

// 图片存本地
router.post('/addUser', function(req, res, next) {
  var user = req.body;
  var date = new Date();
  user.createDate = date;
  let content ={token: req.body.name}; // 要生成token的主题信息
  let secretOrPrivateKey="csm"; // 这是加密的key（密钥） 
  let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 60 * 60 * 24 * 7  // 7天过期
      });
  user.token = token;

  console.log('add img');
  const data = user.img[0].url;

  if (data.substring(0, 4) === 'http') {
    new User(user).save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Server error.');
      }
      res.send({'code': 200, 'token': token, 'data': data});
    });
  } else {
      var filePath = '../src/statics/images/avatar/'+ Date.now() +'.png';
      // 从app.js级开始找--在我的项目工程里是这样的
      var base64 = data.replace(/^data:image\/\w+;base64,/, "");
      // 去掉图片base64码前面部分data:image/png;base64
      var dataBuffer = new Buffer(base64, 'base64'); // 把base64码转成buffer对象
      console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
    
      pWriteFile(filePath, dataBuffer)
      .then(() => {
        console.log('写入成功！');
  
        user.img[0].url = filePath.replace('../src/', '')
  
        new User(user).save(function (err, data) {
          if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
          }
          res.send({'code': 200, 'token': token, 'data': data});
        });
  
      }, (err) => {
        console.log('err:', err);
      })
  }

});

// 检测token
router.post('/checkUser', (req, res)=>{
  User.find({ token: req.body.token, _id: req.body.userId }, (err, data)=>{
      if (err) {
          console.log(err);
          res.send(err);
          return
      }
      if(data.length > 0){
          let token = req.body.token; // 从body中获取token
          let secretOrPrivateKey="csm"; // 这是加密的key（密钥） 
          let verifySuccess = true;
          jwt.verify(token, secretOrPrivateKey, function (err, decode) {
              if (err) {  //  时间失效的时候/ 伪造的token  
                verifySuccess = false;        
                return res.status(500).send('token已失效');  
              } else {
                verifySuccess = true;
              }
          });
          
          if (verifySuccess) {
            let content = {token: req.body.userId}; // 要生成token的主题信息
            var newToken = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 * 7  // 7天过期
                });
            User.updateOne({_id: req.body.userId}, {$set: {token: newToken}}, function (err) {
              if (err) {
                console.log('update err', err)
              }
            }).then(() => {
              res.send({code: 200, userList: data, token: newToken });
            })
          }
      } else {
          return res.status(500).send('没有这个用户');              
      }
  });
})

router.post('/getVerificationCode', function(req, res, next) {
  console.log('req.body', req.body.mobile);
  // var data = {
  //   deviceId: '14828999',
  //   mobile: req.body.mobile
  // }
  // smsRequest.sendSmsCode(data, function(err, data) {
  //   if (err) {
  //     console.log('err:', err)
  //     return res.status(500).send('Server error.')
  //   } else {
  //     console.log(data)
  //     var verificationCode = data.obj
  //     console.log('verificationCode', verificationCode)
      return res.json({ success: true })
  //   }
  // })
});

router.post('/verifyCode', function(req, res, next) {
  console.log('req.body', req.body);
  // smsRequest.verifycode(req.body, function(err, data) {
  //   if (err) {
  //     console.log('err:', err)
  //     return res.status(500).send('Server error.')
  //   }  else {
  //     return res.json({ code: data.code, msg: data.msg });
  
          if (req.body.code === '1111') {
            User.findOne({ phone: req.body.mobile }, function (err, data) {
              if (err) {
                console.log('find err', err)
                return res.status(500).send('Server error.')
              } else {
                if (data) {
                  let content = {token: req.body.mobile}; // 要生成token的主题信息
                  let secretOrPrivateKey="csm" // 这是加密的key（密钥） 
                  var token = jwt.sign(content, secretOrPrivateKey, {
                          expiresIn: 60 * 60 * 24 * 7  // 7天过期
                      });
                  User.updateOne({phone: req.body.mobile}, {$set: {token: token}}, function (err) {
                    if (err) {
                      console.log('update err', err);
                    }
                    data.token = token;
                    return res.json({ code: 200, msg: 'find it', userList: data });
                  })
                } else {
                  console.log('can not find')
                  return res.json({ code: 200, msg: 'can not find' });
                }
              }
            })
          } else {
            return res.json({ code: 413 });
          }
  //   }
  // })
});

// 查找是否有微信授权的这个人
router.post('/checkWechatUser', function(req, res, next) {
    console.log('req.body', req.body);
  
    User.findOne(req.body, function (err, data) {
      if (err) {
        console.log('find err', err)
        return res.status(500).send('Server error.')
      } else {
          if (data) {
            let content = {token: data._id}; // 要生成token的主题信息
            let secretOrPrivateKey="csm" // 这是加密的key（密钥） 
            var token = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24 * 7  // 7天过期
                });
            User.updateOne(req.body, {$set: {token: token}}, function (err) {
              if (err) {
                console.log('update err', err);
              }
              data.token = token;
              return res.json({ code: 200, msg: 'find it', userList: data });
            })
          } else {
            console.log('can not find')
            return res.json({ code: 200, msg: 'can not find' });
          }
      }
    })
 
});

router.post('/getUserInfo', function(req, res, next) {
  // console.log('req.body', req.body);
  User.find({ _id: req.body.userId}, (err, data)=>{
    if (err) {
      console.log(err);
      return res.status(500).send('获取用户信息失败');
    }
    // console.log('data', data);
    return res.json({ code: 200, data: data });
  });
});

// 加关注
router.post('/addConcernUser', function(req, res, next) {
  // console.log('req.body', req.body);
  var writerId = req.body.writerId;
  var userId = req.body.userId;
  var concernList = req.body.concernList;
  var fanList = req.body.fanList;
  var type = req.body.type;

  User.updateOne({_id: writerId}, {$set: {fanList: fanList}})
  .then(() => {
    return User.updateOne({_id: userId}, {$set: {concernList: concernList}})
  })
  .then(() => {
    if (type === 'add') {
      let createDate = new Date();
      new FanInform({writerId, userId, createDate}).save(function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
        }
      });
    }
    return res.json({ code: 200 });
  })
});

// 更新用户个人信息
router.post('/updateUserInfo', function(req, res, next) {
  var user = req.body;
  const data = user.img[0].url;

  if (data.substring(0, 4) === 'data') {
    var filePath = '../src/statics/images/avatar/'+ Date.now() + '.png';
    var base64 = data.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64, 'base64'); // 把base64码转成buffer对象
  
    pWriteFile(filePath, dataBuffer)
    .then(() => {
        console.log('写入成功！');
        user.img[0].url = filePath.replace('../src/', '');
        User.updateOne({_id: user._id}, {$set: {
          avoidFood: user.avoidFood, 
          birthday: user.birthday, 
          gender: user.gender,
          hometown: user.hometown,
          img: user.img,
          livingPlace: user.livingPlace,
          name: user.name,
          profile: user.profile
        }}, function (err, data) {
          if (err) {
            return res.status(500).send('更新用户信息失败');
          }
          console.log('update data', data)
          return res.json({ code: 200 });
        })
    }, (err) => {
      console.log('err:', err);
    })
  } else {
    User.updateOne({_id: user._id}, {$set: {
      avoidFood: user.avoidFood, 
      birthday: user.birthday, 
      gender: user.gender,
      hometown: user.hometown,
      livingPlace: user.livingPlace,
      name: user.name,
      profile: user.profile
    }}, function (err, data) {
      if (err) {
        return res.status(500).send('更新用户信息失败');
      }
      console.log('update data', data)
      return res.json({ code: 200 });
    })
  }
});

// 获取用户的关注
router.post('/getConcernList', function(req, res) {
  let concernIdList = req.body.concernIdList;
  let concernList = [];
  var actionArr = []

  concernIdList.forEach(item => {
      actionArr.push(User.findOne({_id: item}))
  })

  Promise.all(actionArr).then((data) => {
    concernList.push(data);
  }).then(() => {
      return res.json({ code: 200, data: concernList[0] });
  }).catch(function (err) {
      console.log('err', err)
      return res.status(500).send('查询失败');
  })
});

// 获取用户的粉丝
router.post('/getFanList', function(req, res) {
  let fanIdList = req.body.fanIdList;
  let fanList = [];
  var actionArr = []

  fanIdList.forEach(item => {
      actionArr.push(User.findOne({_id: item}))
  })

  Promise.all(actionArr).then((data) => {
    fanList.push(data);
  }).then(() => {
      return res.json({ code: 200, data: fanList[0] });
  }).catch(function (err) {
      console.log('err', err)
      return res.status(500).send('查询失败');
  })
});

module.exports = router;
