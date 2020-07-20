
var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCatModel = require('../modules/password_category')
var passModel = require('../modules/add_password')

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});
/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next ){
  var userToken=localStorage.getItem('userToken')
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Email Already Exist' });

 }
 next();
  });
}

function checkUsername(req,res,next){
  var uname=req.body.uname;
  var checkexistuname=userModule.findOne({username:uname});
  checkexistuname.exec((err,data)=>{
 if(err) throw err;
 if(data){
  
return res.render('signup', { title: 'Password Management System', msg:'Username Already Exist' });

 }
 next();
  });
}
      router.get('/edit/:id',checkLoginUser, function(req, res, next) {
        var loginUser = localStorage.getItem('loginUser');
        var id=req.params.id;
     var getPassDetail = passModel.findById({_id:id});

     getPassDetail.exec(function(err,data){
          if(err) throw err;
          getPassCat.exec(function(err,data1){
          res.render('edit-password-detail', { title: 'Password Management System',loginUser:loginUser,success:'', record:data, records:data1});
        });
        });
     });

     router.post('/edit/:id',checkLoginUser, function(req, res, next) {
      var loginUser = localStorage.getItem('loginUser');
      var id=req.params.id;
      var passcat = req.body.pass_cat;
      var project_name = req.body.project_name;
      var pass_details = req.body.pass_details;
         passModel.findByIdAndUpdate(id,{ password_category:passcat,  projet_names :project_name, password_detail :pass_details }).exec(function(err){
      if(err) throw err;
          var getPassDetail = passModel.findById({_id:id});

   getPassDetail.exec(function(err,data){
        if(err) throw err;
        getPassCat.exec(function(err,data1){
        res.render('edit-password-detail', { title: 'Password Management System',loginUser:loginUser,success:'Password Update Successfully', record:data, records:data1});
      });
      });
  
    });
      });

      router.get('/delete/:id', checkLoginUser,function(req, res, next) {
        var loginUser = localStorage.getItem('loginUser');
        var id=req.params.id;
        var passdelete= passModel.findByIdAndDelete(id);
        passdelete.exec(function(err){
          if(err) throw err;
          res.redirect('/view-all-password');
        })
      
      });

module.exports = router;