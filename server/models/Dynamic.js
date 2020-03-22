/**
 * recipes 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var DynamicSchema = new Schema({
  imgs: {
    type: Array
  },
  recommend: {
    type: Array
  },
  dynamicName: {
    type: String
  },
  dynamicStory: {
    type: String
  },
  createDate: {
    type: Date
  },
  userId: {
    type: String
  },
  relatedMenu: {
    type: String
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('Dynamic', DynamicSchema, 'dynamic')
