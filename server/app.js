var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var bodyParser = require('body-parser')

var mongo = require('./utils/db');

var informRouter = require('./routes/informAPI');
var userRouter = require('./routes/userAPI');
var recipesRouter = require('./routes/recipesAPI');
var dynamicRouter = require('./routes/dynamicAPI');
var searchRouter = require('./routes/searchAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// 把路由容器挂载到 app 服务中
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/inform', informRouter);
app.use('/user', userRouter);
app.use('/recipes', recipesRouter);
app.use('/dynamic', dynamicRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// //设置跨域访问  
// app.all('*', function(req, res, next) {  
//   res.header("Access-Control-Allow-Origin", "*");  
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");  
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
//   res.header("X-Powered-By",' 3.2.1')  
//   res.header("Content-Type", "application/json;charset=utf-8");  
//   next();  
// });  
module.exports = app;
