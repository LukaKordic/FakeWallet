var express = require('express');
var router = express.Router();
var randomNumber = require('random-number');

let Transaction = require('../models/transaction');
let User = require('../models/user');
let Sale = require('../models/sale');

let options = {
  min: 8,
  max: 9,
  float: true
}
let value = randomNumber(options);

router.get('/myWallet', ensureAuthenticated, function(req, res){
  res.render('myWallet', {
    value:value
  });
});

router.get('/transaction', ensureAuthenticated, function(req, res){
  res.render('transaction');
});

router.post('/transaction', function(req, res){

  const loggedUser = req.user;

  req.checkBody('wallet_address', 'Wallet address is required.').notEmpty().isLength({min:34});
  req.checkBody('amount', 'Amount is required.').notEmpty().isDecimal();
  req.checkBody('private_key', 'Private key is not valid.').equals(loggedUser.private_key);
  req.checkBody('private_key', 'Private key is required.').notEmpty();

  const wallet_address = req.body.wallet_address;
  const amount = parseFloat(req.body.amount);
  const private_key = req.body.private_key;

  let errors = req.validationErrors();
  if(errors){
    res.render('transaction', {
      errors:errors
    });
  } else {
    let query = {wallet_address:wallet_address};
    //get receiver
    User.findOne(query, function(err, user){
      if (err) {
        console.log(err);
      } else {
        if (loggedUser.amount >= amount) {
          loggedUser.amount -= amount;
          user.amount += amount;
          loggedUser.save();
          user.save();

          let newTransaction = new Transaction({
            sender:loggedUser.username,
            receiver:user.username,
            amount:amount
          });

          newTransaction.save(function(err){
            if (err) {
              console.log(err);
            }
          });

          req.flash('success', 'Transaction successfull.');
          res.redirect('/wallets/myWallet');
        } else {
          req.flash('danger', 'Unsufficient amount!');
          res.redirect('/wallets/transaction');
        }
      }
    });
  }
});


//All transactions
router.get('/allTransactions', ensureAuthenticated, ensureAdmin, function(req, res){
  Transaction.find(function(err, transactions){
    if (err) {
      console.log(err);
    }else {
      res.render('allTransactions', {
        transactions:transactions
      });
    }
  })
});

//All transactions
router.get('/buySell', ensureAuthenticated, function(req, res){
  Sale.find(function(err, sales){
    if (err) {
      console.log(err);
    }else {
      res.render('buySell', {
        sales:sales,
        user:req.user,
        value:value
      });
    }
  })
});

//add money to bank account
router.post('/addMoneyToBankAccount', ensureAuthenticated, function(req, res){
  loggedUser = req.user;
  loggedUser.bank_balance += parseFloat(req.body.money);
  loggedUser.save();
  res.redirect('/wallets/myWallet');
});

//sellCroCoins
router.post('/sellCroCoins', ensureAuthenticated, function(req, res){
  loggedUser = req.user;
  if(loggedUser.private_key == req.body.private_key){
    if(loggedUser.amount >= req.body.money){
      loggedUser.amount -= req.body.money;

      let newSale = new Sale({
        seller:loggedUser.username,
        amount:req.body.money
      });

      newSale.save(function(err){
        if (err) {
          console.log(err);
        }

        req.flash('success', 'Your CroCoins are on sale.');
        res.redirect('/wallets/buySell');
      });
    }else{
      req.flash('danger', 'Unsufficient amount.');
    }
  }else{
    req.flash('danger', 'Private key is not valid.');
  }
});

//Access Control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

function ensureAdmin(req, res, next){
  if (req.user.isAdmin) {
    return next();
  }else {
    req.flash('danger', 'You are not authorized to do that!');
    res.redirect('/');
  }
}

module.exports = router;
