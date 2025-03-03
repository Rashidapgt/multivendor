const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Order', OrderSchema);