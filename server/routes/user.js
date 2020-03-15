var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SmsRequest = require('../utils/smsRequest');

// 网易云信
const appKey = "1463872763e2ebb7e7040d5ba4cd1544";
const appSecret = "a9abe64af57c";
var smsRequest = new SmsRequest(appKey, appSecret);

/* GET user listing. */
router.get('/getUser', function(req, res, next) {
  User.find(function (err, data) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    return res.json({ success: true, data: data });
  })
});

router.post('/addUser', function(req, res, next) {
  new User(req.body).save(function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    return res.json({ success: true });
  })
});

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
  if (req.body.code === '1111') {
    return res.json({ code: 200 });
  } else {
    return res.json({ code: 413 });
  }
  // smsRequest.verifycode(req.body, function(err, data) {
  //   if (err) {
  //     console.log('err:', err)
  //     return res.status(500).send('Server error.')
  //   }  else {
  //     return res.json({ code: data.code, msg: data.msg });
  //   }
  // })
});


// const oauth = new OAuth('wxf5fff2aa6e0b1af7', 'f396ab92d74c2ba72021d102aa67750b')
// router.get('/wxAuthorize', async ctx => {
//     const state = ctx.query.id
//     redirectUrl = ctx.href
//     redirectUrl = redirectUrl.replace('wxAuthorize', 'wxCallback')
//     const scope = 'snsapi_userinfo' //授权类型
//     const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
//     console.log('url:', url)
//     ctx.redirect(url)
// })
// router.get('/wxCallback', async ctx => {
//     const code = ctx.query.code // 授权码
//     console.log('wxCallback.....', code)
//     const token = await oauth.getAccessToken(code)
//     const accessToken = token.data.access_token
//     const openid = token.data.openid
//     console.log('accessToken', accessToken)
//     console.log('openid', openid)
//     ctx.redirect('/?openid=' + openid)
// })
const AppID = 'wxf5fff2aa6e0b1af7';
const AppSecret = 'f396ab92d74c2ba72021d102aa67750b';

router.get('/wechat_login', function(req,res, next){
  // 第一步：用户同意授权，获取code
  var router = 'get_wx_access_token';
  // 这是编码后的地址
  var return_uri = 'https%3A%2F%2F0a78b083.ngrok.io'+router;  
  var scope = 'snsapi_userinfo';
  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
});

router.get('/get_wx_access_token', function(req, res, next){
  // 第二步：通过code换取网页授权access_token
  var code = req.query.code;
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
                          res.send("\
                              <h1>"+userinfo.nickname+" 的个人信息</h1>\
                              <p><img src='"+userinfo.headimgurl+"' /></p>\
                              <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                              <p>openid: "+userinfo.openid+"</p>\
                          ");
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

module.exports = router;
