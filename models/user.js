let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  wallet_address:{
    type: String,
    required: true
  },
  private_key:{
    type: String,
    required: true
  }
});

let User = module.exports = mongoose.model('User', userSchema);
