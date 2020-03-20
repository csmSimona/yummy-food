/**
 * user 表结构
 **/

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var RecipesSchema = new Schema({
  album: {
    type: Array,
    required: true
  },
  cookSteps: {
    type: Array
  },
  materials: {
    type: Array
  },
  recipeName: {
    type: String
  },
  recipeStory: {
    type: String
  },
  recipeTips: {
    type: String
  },
  recommend: {
    type: Array
  },
  selected: {
    type: Array
  },
  createTime: {
    type: Date
  },
  userId: {
    type: String
  }
}, {
  versionKey:false
})

// 直接导出模型构造函数
module.exports = mongoose.model('Recipes', RecipesSchema, 'recipes')
