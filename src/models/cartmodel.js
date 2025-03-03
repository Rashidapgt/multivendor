const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Cart', CartSchema);