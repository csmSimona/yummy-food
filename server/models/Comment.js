/**
 * comment 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CommentSchema = new Schema({
  writerId: {       // 菜谱/动态作者
    type: String
  },
  userId: {         // 发布这条评论的人
    type: String
  },
  recipeId: {
    type: String
  },
  dynamicId: {
    type: String
  },
  content: {
    type: String
  },
  replyId: {
    type: String
  },
  createDate: {
    type: Date
  }
}, {
  versionKey:false
})

// 直接导出模型构造函数
module.exports = mongoose.model('comment', CommentSchema, 'comment')
