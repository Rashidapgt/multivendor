const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/ordercontroller');
const { auth } = require('../middlewares/auth'); // Import the auth middleware

// Create a new order (authentication required)
router.post('/', auth, createOrder);

// Get all orders (authentication required, may be restricted to admin only)
router.get('/', auth, getAllOrders);

// Get a specific order by ID (authentication required)
router.get('/:id', auth, getOrderById);

// Update order (authentication required, may restrict update to the order owner or admin)
router.put('/:id', auth, updateOrder);

// Delete order (authentication required, may restrict delete to the order owner or admin)
router.delete('/:id', auth, deleteOrder);

module.exports = router;
