/**
 * situation 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var SituationSchema = new Schema({
  type: {
    type: String
  },
  icon: {
    type: String
  },
  list: {
    type: Array
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('situation', SituationSchema, 'situation')
