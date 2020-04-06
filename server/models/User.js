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
  phone: {
    type: Number
  },
  gender: {
    type: String
  },
  hometown: {
    type: Array
  },
  createDate: {
    type: Array
  },
  hometown: {
    type: Array
  },
  livingPlace: {
    type: Array
  },
  avoidFood: {
    type: Array
  },
  profile: {
    type: String
  },
  img: {
    type: Array
  },
  token: {
    type: String
  },
  collectRecipes: {
    type: Array
  },
  likeDynamic: {
    type: Array
  },
  concernList: {
    type: Array
  },
  fanList: {
    type: Array
  }
}, {
  versionKey:false
})

// 直接导出模型构造函数
module.exports = mongoose.model('User', UserSchema, 'user')
