const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } = require('../controllers/paymentcontroller');
const { auth } = require('../middlewares/auth'); // Import the auth middleware

// Create a payment (authentication required)
router.post('/', auth, createPayment);

// Get all payments (you may want to restrict this to admin only)
router.get('/', auth, getAllPayments);

// Get payment by ID (authentication required)
router.get('/:id', auth, getPaymentById);

// Update payment status (authentication required, typically for admins or authorized users)
router.put('/:id', auth, updatePayment);

// Delete payment (authentication required, typically for admins)
router.delete('/:id', auth, deletePayment);

module.exports = router;
