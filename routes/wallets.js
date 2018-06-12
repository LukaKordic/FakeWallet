var express = require('express');
var router = express.Router();

let Wallet = require('../models/wallet');
let Transaction = require('../models/transaction');
let User = require('../models/user');

//Register form
router.get('/all', function(req, res){
  res.render('all');
});

router.get('/myWallet', function(req, res){
  res.render('myWallet');
});

router.get('/transaction', function(req, res){
  res.render('transaction');
});

router.post('/transaction', function(req, res){

  // TODO: add length checks on address and key
  req.checkBody('wallet_address', 'Wallet address is required.').notEmpty();
  req.checkBody('amount', 'Amount is required.').notEmpty().isDecimal();
  req.checkBody('private_key', 'Private key is not valid.').equals(req.body.private_key);
  req.checkBody('private_key', 'Private key is required.').notEmpty();

  const wallet_address = req.body.wallet_address;
  const amount = req.body.amount;
  const private_key = req.body.private_key;
  const loggedUser = req.user;

  let errors = req.validationErrors();
  if(errors){
    res.render('transaction', {
      errors:errors
    });
  } else {
    let query = {wallet_address:wallet_address};
    User.find(query, function(err, user){
      if (err) {
        console.log("ovdje je jebena greska"+err);
      } else {
        console.log(user);
      }
    });

    req.flash('success', 'Transaction successfull.');
    res.redirect('/wallets/myWallet');
  }
});

module.exports = router;
