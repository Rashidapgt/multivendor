const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCart, clearCart } = require('../controllers/cartcontroller');
const { auth } = require('../middlewares/auth');  // Import the auth middleware

// Add to cart (authentication required)
router.post('/', auth, addToCart);

// Get cart (authentication required)
router.get('/', auth, getCart);

// Update cart (authentication required)
router.put('/', auth, updateCart);

// Clear cart (authentication required)
router.delete('/', auth, clearCart);

module.exports = router;
