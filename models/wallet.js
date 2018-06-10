let mongoose = require('mongoose');

let walletSchema = mongoose.Schema({
  address:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  }
});

let Wallet = module.exports = mongoose.model('Wallet', walletSchema);
