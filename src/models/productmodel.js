const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }], 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    ratings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Product', ProductSchema);