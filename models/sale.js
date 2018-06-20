let mongoose = require('mongoose');

let saleSchema = mongoose.Schema({
  seller:{
    type: String,
    required: true
  },
  amount:{
    type: String,
    required: true
  }
});

let Sale = module.exports = mongoose.model('Sale', saleSchema);
