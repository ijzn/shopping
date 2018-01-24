// 引入mongoose
var mongoose = require('mongoose')
// 定义数据结构 
var Schema = mongoose.Schema;

var produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "productNum":Number,
  "checked":String,
  "productImage":String
});
module.exports = mongoose.model('Good',produtSchema,"goods");
