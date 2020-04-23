/**
 * recommend 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var RecommendSchema = new Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  ingredients: {
    type: Array
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('recommend', RecommendSchema, 'recommend')
