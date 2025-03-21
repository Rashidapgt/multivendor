const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, default: 0 },
  appliedCoupon: {
    code: { type: String },
    discountPercentage: { type: Number },
    discountAmount: { type: Number },
  },
  totalAfterDiscount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model('Cart',cartSchema);