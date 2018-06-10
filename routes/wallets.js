var express = require('express');
var router = express.Router();

let Wallet = require('../models/wallet');

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
  const wallet_address = req.body.wallet_address;
  const amount = req.body.amount;
  const private_key = req.body.private_key;

  req.checkBody('wallet_address', 'Wallet address is requiered.').notEmpty();
  req.checkBody('amount', 'Amount is requiered.').notEmpty();
  req.checkBody('private_key', 'Private key is not valid.').equals(req.body.private_key);
  req.checkBody('private_key', 'Private key is requiered.').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else{
    let newTransaction = new Transaction({
      private_key:private_key,
      amount:amount,
      wallet_address:wallet_address
    });
    req.flash('success', 'Transaction successfull.');
    res.redirect('/wallets/myWallet');
  }
});

module.exports = router;
