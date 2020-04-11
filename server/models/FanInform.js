/**
 * fanInform 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var FanInformSchema = new Schema({
  writerId: {       //  关注人id
    type: String
  },
  userId: {         //  粉丝id
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
module.exports = mongoose.model('fanInform', FanInformSchema, 'fanInform')
