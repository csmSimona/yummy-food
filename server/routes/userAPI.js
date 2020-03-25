var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SmsRequest = require('../utils/smsRequest');
const request = require('request');
const jwt = require('jsonwebtoken');
var pWriteFile = require('../utils/pWriteFile');

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
  let content ={phone: req.body.phone}; // 要生成token的主题信息
  let secretOrPrivateKey="csm"; // 这是加密的key（密钥） 
  let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 60 * 60 * 24  // 24小时过期
      });
  user.token = token;

  console.log('add img');
  const data = user.img[0].url;
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
        res.send({'code': 200, 'token': token, 'user_name': req.body.name, 'userId': data._id});
      });

    }, (err) => {
      console.log('err:', err);
    })

});

// 检测token
router.post('/checkUser', (req, res)=>{
  User.find({ token: req.body.token }, (err, data)=>{
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
            let content = {phone: data.phone}; // 要生成token的主题信息
            var newToken = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 24  // 24小时过期
                    // expiresIn: 60  // 60s过期
                });
            User.updateOne({phone: data.phone}, {$set: {token: newToken}}, function (err) {
              if (err) {
                console.log('update err', err)
              }
            })
            res.send({code: 200, userList: data, token: token });
          }
      } else{
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
                  let content = {phone: req.body.mobile}; // 要生成token的主题信息
                  let secretOrPrivateKey="csm" // 这是加密的key（密钥） 
                  var token = jwt.sign(content, secretOrPrivateKey, {
                          expiresIn: 60 * 60 * 24  // 24小时过期
                      });
                  User.updateOne({phone: req.body.mobile}, {$set: {token: token}}, function (err) {
                    if (err) {
                      console.log('update err', err)
                    }
                  })
                  return res.json({ code: 200, msg: 'find it', token: token, user_name: data.name, userList: data });
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

// 微信授权登录
const AppID = 'wxf5fff2aa6e0b1af7';
const AppSecret = 'f396ab92d74c2ba72021d102aa67750b';

router.get('/wechat_login', function(req,res, next){
  // 第一步：用户同意授权，获取code
  // var router = 'get_wx_access_token';
  // 这是编码后的地址
  var return_uri = encodeURIComponent('http://88841d2f.ngrok.io');  
  var scope = 'snsapi_userinfo';
  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
});

router.get('/get_wx_access_token', function(req, res, next){
  // 第二步：通过code换取网页授权access_token
  // var code = req.query.code;
  var code = '011jfSxE06PQSi2p30AE0LEMxE0jfSxM';
  request.get(
      {   
          url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
      },
      function(error, response, body){
          if(response.statusCode == 200){
              // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
              //console.log(JSON.parse(body));
              var data = JSON.parse(body);
              var access_token = data.access_token;
              var openid = data.openid;
              request.get(
                  {
                      url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                  },
                  function(error, response, body){
                      if(response.statusCode == 200){
                          // 第四步：根据获取的用户信息进行对应操作
                          var userinfo = JSON.parse(body);
                          console.log('获取微信信息成功！');
                          //其实，到这就写完了，你应该拿到微信信息以后去干该干的事情，比如对比数据库该用户有没有关联过你们的数据库，如果没有就让用户关联....等等等...
                          // 小测试，实际应用中，可以由此创建一个帐户
                          // res.send("\
                          //     <h1>"+userinfo.nickname+" 的个人信息</h1>\
                          //     <p><img src='"+userinfo.headimgurl+"' /></p>\
                          //     <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                          //     <p>openid: "+userinfo.openid+"</p>\
                          // ");
                      }else{
                          console.log(response.statusCode);
                      }
                  }
              );
          }else{
              console.log(response.statusCode);
          }
      }
    )
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

  User.updateOne({_id: writerId}, {$set: {fanList: fanList}}, function (err) {
    if (err) {
      return res.status(500).send('关注失败');
    }
  })

  User.updateOne({_id: userId}, {$set: {concernList: concernList}}, function (err) {
    if (err) {
      return res.status(500).send('关注失败');
    }
  })
  return res.json({ code: 200 });
});

module.exports = router;
