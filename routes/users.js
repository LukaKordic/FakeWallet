var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs');
const randomstring = require('randomstring');
const passport = require('passport');

let User = require('../models/user');

//Register form
router.get('/register', function(req, res){
  res.render('register');
});

//Register post
router.post('/register', function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const email = req.body.email;

  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email is not valid.').isEmail();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else{
    let newUser = new User({
      username:username,
      email:email,
      password:password,
      amount: 50,
      wallet_address: randomstring.generate({
        length: 34,
        charset: 'alphabetic'
      }),
      private_key: randomstring.generate({
        length: 64,
        charset:'alphabetic'
      })
    });
    bcryptjs.genSalt(10, function(err, salt){
      bcryptjs.hash(newUser.password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if (err) {
            console.log(err);
          } else {
            res.redirect('/users/login');
            req.flash('success', 'You are now registered and can login');
          }
        });
      });
    });
  }
});

//Login form
router.get('/login', function(req, res){
  res.render('login');
});

//Login proccess
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//logout
router.get('/logout',function(req, res){
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/users/login');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
