var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');


//连接MongoDB数据库
mongoose.connect('mongodb://47.96.172.85:27017/test');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

// 查询商品列表数据
router.get('/list',(req,res,next)=>{
  // 页码
  let page = parseInt(req.param('page'));
  // 每页数据
  let pageSize = parseInt(req.param('pageSize'));
  // 价格区间
  let priceLevel = req.param('priceLevel');  
  // 排序
  let sort = req.param('sort');
  let skip = (page-1)*pageSize;
  let priceGt = '',priceLte = '';
  let params = {};
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0' : priceGt = 0;priceLte = 100;break;
      case '1' : priceGt = 100;priceLte = 500;break;
      case '2' : priceGt = 500;priceLte = 1000;break;
      case '3' : priceGt = 1000;priceLte = 5000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  } 

  // 条件查询所有数据  
  // let goodsmodel = Goods.find(params);
  // 条件查询所有数据  默认跳过几条数据  拿去几条数据
  let goodsmodel = Goods.find(params).skip(skip).limit(pageSize);
  // 按  价格 排序
  goodsmodel.sort({'salePrice':sort})
  goodsmodel.exec({}, (err,doc)=>{
    if (err) {
      res.json({
        statue: '0',
        msg: err.message
      })
    } else {
      res.json({
        statue: '1',
        msg:'',
        result: {
          count: doc.length,
          list: doc,
        }
      })
    }
  })
})

// 加入购物车
router.post('/addCart',(req,res,next) =>{
  let userId = "100000077",productId = req.body.productId;
  User.findOne({userId : userId},(err1,userDoc)=>{
    if (err1) {
      res.json({
        statue:'0',
        msg:err1.message,
      })
    } else {
      if (userDoc) {
        Goods.findOne({productId:productId},(err2,doc2) => {
          if (err2) {
            res.json({
              statue:'0',
              msg:err2.message,
            })
          } else {
            if(doc2) {
              doc2.productNum = 1;
              doc2.checked = 1;
              // 保存入数据库
              userDoc.cartList.push(doc2)
              userDoc.save((err3,doc3)=>{
                if (err3) {
                  res.json({
                    statue:'0',
                    msg:err.message,
                  })
                } else {
                  res.json({
                    statue:'1',
                    msg:'',
                    result:'success',
                  })
                }
              })
            }
          }
        })
      }
    }
  })
})
module.exports = router;