
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

router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('/dashboard');
  }else{
  res.render('index', { title: 'Password Management System',msg:'' });
}
});

router.post('/', function(req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({username:username})
  checkUser.exec((err,data)=>{
  if(err) throw err;
  var getUserID = data._id;
  var getPassword = data.password; // password of database 
  if(bcrypt.compareSync(password,getPassword))
  {
    var token = jwt.sign({ userID: 'getUserID' }, 'loginToken');
    localStorage.setItem('userToken', token);
    localStorage.setItem('loginUser', username);
    res.redirect('./dashboard');
  }else{
        res.render('index', { title: 'Password Management System',msg:"Envalid Username and Password" });
  }
});
});
router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser)
  {
    res.redirect('/dashboard');
  }else{
res.render('signup', { title: 'Password Management System',msg:''});
}
});

router.post('/signup',checkEmail,checkUsername,function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  if(password !=confpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password not matched!' });
   
  }else{
    password =bcrypt.hashSync(req.body.password,10);
  var userDetail = new userModule({
    username:username,
    email:email,
    password:password
  });
  
  userDetail.save((err,doc)=>{
  if(err) throw err;
  res.render('signup', { title: 'Password Management System',msg:'User Register Successfully' });
  });
}  
  });

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
 
});

module.exports = router;