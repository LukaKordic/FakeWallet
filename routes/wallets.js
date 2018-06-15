var express = require('express');
var router = express.Router();

let Wallet = require('../models/wallet');
let Transaction = require('../models/transaction');
let User = require('../models/user');

router.get('/myWallet', ensureAuthenticated, function(req, res){
  res.render('myWallet');
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
router.get('/allTransactions', function(req, res){
  res.render('allTransactions');
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

module.exports = router;
