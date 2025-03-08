const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  validUntil: { type: Date },
  minOrderAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Coupon', couponSchema);
