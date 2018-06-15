let mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  sender:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  },
  receiver:{
    type: String,
    required: true
  }
});

let Transaction = module.exports = mongoose.model('Transaction', transactionSchema);
