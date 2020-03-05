/**
 * 连接数据库
 */
var mongoose = require('mongoose');

var DB_URL = 'mongodb://localhost:27017/yummyfood';

mongoose.connect(DB_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });
mongoose.connection.on('connected', function (err) {
    if (err) {
        console.log(err, "mongodb connect fail!");
        return;
    }
    console.log('mongodb connect success!');
});