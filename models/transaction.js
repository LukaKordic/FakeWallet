let mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  wallet_address:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  },
  private_key:{
    type: String,
    required: true
  }
});

let Transaction = module.exports = mongoose.model('Transaction', transactionSchema);
