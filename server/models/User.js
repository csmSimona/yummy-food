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
    type: String
  },
  gender: {
    type: Array
  },
  hometown: {
    type: Array
  },
  createDate: {
    type: Date
  },
  birthday: {
    type: Date
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
  },
  access_token: {
    type: String
  },
  openid: {
    type: String
  }
}, {
  versionKey:false
})

// 直接导出模型构造函数
module.exports = mongoose.model('user', UserSchema, 'user')
