const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productcontroller');
const { auth, adminOnly } = require('../middlewares/auth');

// Protect product routes with authentication
router.post('/', auth, createProduct); // Only vendors can create products
router.get('/', getAllProducts); // Public route, no auth needed
router.get('/:id', getProductById); // Public route, no auth needed
router.put('/:id', auth, updateProduct); // Only vendor or admin can update product
router.delete('/:id', auth, adminOnly, deleteProduct); // Only admin can delete product

module.exports = router;
