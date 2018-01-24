var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user');


/* GET users listing. */
router.post('/login',(req, res, next)=>{
  let parame = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  }
  User.findOne(parame,(err,doc)=>{
    if (err) {
      res.json({
        status: '0',
        msg: err.message
      })
    } else {
      if (doc) {
        // 存在cooki中
        res.cookie('userId',doc.userId,{
          path: '/',
          maxAge: 1000*60*60,
        })

        res.cookie('userName',doc.userName,{
          path: '/',
          maxAge: 1000*60*60,
        })
        // 存在session中，session  是前端传过来的，
        // req.session.user = doc;
        res.json({
          status: '1',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: '100',
          msg:'账号或者密码错误',
          result:{}
        })
      }
    }
  })
  
})

// 退出登录
router.post('/logout',(req,res,next)=>{
  res.cookie('userId','',{
    path:'/',
    maxAge:-1,
  })
  res.json({
    status:'1',
    msg:'该账号已退出',
    result:{}
  })
})

// 登录检测
router.get('/checkLogin',(req,res,next)=>{
  if (req.cookies.userName) {
    res.json({
      status:'1',
      msg:'',
      result: req.cookies.userName,
    })
  } else {
    res.json({
      status: '0',
      msg: '未登录',
      result: '',
    })
  }
})

// 查询当前用户的购物车
router.get('/cartList',(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: '',
      })
    } else {
      if (doc) {
        res.json({
          status : '1',
          msg: '',
          result:doc.cartList
        })
      } else{
        res.json({
          status : '102',
          msg: '该用户不存在',
          result:[]
        })
      }
    }
  })
})

// 删除当前用户购物车的购物数据。
router.post('/cart/del',(req,res,next)=>{
  let userId = req.cookies.userId,
      productId = req.body.productId;
  User.update(
    {
      userId:userId
    },
    {
      $pull:{
        'cartList':{
          'productId':productId
        }
      }
    },
    (err,doc)=>{
      if (err) {
        res.json({
          status: '0',
          msg:err.message,
          result:''
        })
      } else {
        res.json({
          status: '1',
          msg: '',
          result:'suc'
        })
      }
    }
  )
})

// 修改购物车数量，已经选中的状态
router.post('/cart/edit',(req,res,next)=>{
  let userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },(err,doc)=>{
    if (err)  {
      res.json({
        status:'0',
        msg:err.message,
        result:''
      })
    } else {
      res.json({
        status:'1',
        msg:'',
        result:'suc'
      })
    }
  })

})

// 购物车 全选 保存
router.post('/cart/checkedAll',(req,res,next)=>{
  let userId = req.cookies.userId,
    checkedAll = req.body.checkedAll?'1':'0';
    User.findOne({userId:userId},(err,user)=>{
      if (err) {
        res.json({
          status:'0',
          msg: err.message,
          result: '',
        })
      } else {
        if (user) {
          user.cartList.forEach(el => {
            el.checked = checkedAll
          });
        }
        user.save((err1,doc)=>{
          if (err1) {
            res.json({
              status:'0',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status:'1',
              msg: '',
              result: 'suc',
            })
          }
        })
      }
    })    
})

// 查询地址列表
router.get('/address',(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: '',
      })
    } else {
      if (doc) {
        res.json({
          status:'1',
          msg:'',
          result:doc.addressList
        })
      } else {
        res.json({
          status:'102',
          msg:'该账号不存在',
          result:''
        })
      }
    }
  })  
})


// 设置默认地址
router.post("/setDefault", function (req,res,next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    });
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'0',
          msg:err.message,
          result:''
        });
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==addressId){
             item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save(function (err1,doc1) {
          if(err){
            res.json({
              status:'0',
              msg:err.message,
              result:''
            });
          }else{
              res.json({
                status:'1',
                msg:'',
                result:''
              });
          }
        })
      }
    });
  }
});


// 删除商品地址
router.post('/delAddress',(req,res,next)=>{
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
  User.update(
    {userId:userId},
    {
      $pull:{
        'addressList':{
          'addressId':addressId
        }
      }
    },
    (err,doc)=>{
      if (err) {
        res.json({
          status:'0',
          msg:err.message,
          result:''
        })
      } else {
        res.json({
          status:'1',
          msg:'',
          result:'suc'
        })
      }
    }
  )
})

// 


module.exports = router;
