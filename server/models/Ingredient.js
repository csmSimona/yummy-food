/**
 * ingredient 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var IngredientSchema = new Schema({
  name: {
    type: String
  },
  alias: {
    type: String
  },
  intake: {
    type: String
  },
  suitable: {
    type: String
  },
  avoid: {
    type: String
  },
  img: {
    type: String
  },
  introduce: {
    type: String
  }
}, {
  versionKey: false
})

// 直接导出模型构造函数
module.exports = mongoose.model('ingredient', IngredientSchema, 'ingredient')
