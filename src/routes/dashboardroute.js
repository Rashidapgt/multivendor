const express = require('express');
const { auth, adminOnly, vendorOnly, buyerOnly } = require('../middlewares/auth');

const router = express.Router();

// Admin Dashboard Route (Admin only)
router.get('/admin-dashboard', auth, adminOnly, (req, res) => {
    // Admin-specific data, e.g., users, orders, etc.
    res.json({
        message: "Welcome to the Admin Dashboard",
        data: {
            users: ["User 1", "User 2"],
            orders: ["Order 1", "Order 2"],
        }
    });
});

// Vendor Dashboard Route (Vendor only)
router.get('/vendor-dashboard', auth, vendorOnly, (req, res) => {
    // Vendor-specific data, e.g., products, orders related to vendor, etc.
    res.json({
        message: "Welcome to the Vendor Dashboard",
        data: {
            products: ["Product 1", "Product 2"],
            orders: ["Vendor Order 1", "Vendor Order 2"],
        }
    });
});

// Buyer Dashboard Route (Buyer only)
router.get('/buyer-dashboard', auth, buyerOnly, (req, res) => {
    // Buyer-specific data, e.g., orders, wishlist, etc.
    res.json({
        message: "Welcome to the Buyer Dashboard",
        data: {
            orders: ["Buyer Order 1", "Buyer Order 2"],
            wishlist: ["Product A", "Product B"],
        }
    });
});

module.exports = router;
