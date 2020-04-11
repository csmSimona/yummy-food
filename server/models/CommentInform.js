/**
 * commentInform 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CommentInformSchema = new Schema({
  writerId: {       //  发评论的人
    type: String
  },
  userId: {         //  被评论的人
    type: String
  },
  commentId: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  versionKey:false
})

// 直接导出模型构造函数
module.exports = mongoose.model('commentInform', CommentInformSchema, 'commentInform')
