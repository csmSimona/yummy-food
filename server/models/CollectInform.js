/**
 * collectInform 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CollectInformSchema = new Schema({
  writerId: {       
    type: String
  },
  userId: {         
    type: String
  },
  recipeId: {         
    type: String
  },
  createDate: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('collectInform', CollectInformSchema, 'collectInform')
