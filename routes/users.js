var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs');
const randomstring = require('randomstring');

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

  let newUser = new User({
    username:username,
    email:email,
    password:password,
    wallet_address: randomstring.generate({
      length: 26,
      charset: 'alphabetic'
    }),
    private_key: randomstring.generate({
      length: 22,
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
        }
      });
    });
  });
});

router.get('/login', function(req, res){
  res.render('login');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
