/**
 * classification 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ClassificationSchema = new Schema({
  name: {
    type: String
  },
  parentId: {
    type: String
  },
  list: {
    type: Array
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('Classification', ClassificationSchema, 'classification')
