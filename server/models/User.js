/**
 * user 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  age: {
    type: Number
  },
  hobbies: {
    type: String
  }
})

// 直接导出模型构造函数
module.exports = mongoose.model('User', UserSchema)
